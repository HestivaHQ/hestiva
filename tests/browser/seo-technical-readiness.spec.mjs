import { expect, test } from "@playwright/test";

const SITE_URL = "https://www.homent.co.za";

async function sitemapPaths(request) {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBeTruthy();
  const xml = await response.text();
  const paths = [...xml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((match) => match[1] || "/");
  expect(paths.length).toBeGreaterThan(0);
  return [...new Set(paths)];
}

function canonicalFor(path) {
  return `${SITE_URL}${path === "/" ? "/" : path.replace(/\/+$/, "")}`;
}

test.describe("SEO and technical launch readiness", () => {
  test("every sitemap page renders complete indexable metadata with stable canonicals", async ({ page, request }) => {
    test.setTimeout(240_000);
    const paths = await sitemapPaths(request);
    const failures = [];
    const titles = new Map();

    for (const path of paths) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      if (!response || response.status() >= 400) {
        failures.push(`${path}: HTTP ${response?.status() ?? "no response"}`);
        continue;
      }

      const title = (await page.title()).trim();
      const description = ((await page.locator('meta[name="description"]').getAttribute("content")) || "").trim();
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      const robots = ((await page.locator('meta[name="robots"]').getAttribute("content")) || "").toLowerCase();
      const googlebot = ((await page.locator('meta[name="googlebot"]').getAttribute("content")) || "").toLowerCase();
      const ogUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
      const ogTitle = ((await page.locator('meta[property="og:title"]').getAttribute("content")) || "").trim();
      const ogDescription = ((await page.locator('meta[property="og:description"]').getAttribute("content")) || "").trim();
      const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute("content");
      const lang = await page.locator("html").getAttribute("lang");
      const expectedCanonical = canonicalFor(path);

      if (!title) failures.push(`${path}: missing title`);
      if (title.length > 70) failures.push(`${path}: title is ${title.length} characters`);
      if (!description) failures.push(`${path}: missing meta description`);
      if (description.length > 180) failures.push(`${path}: meta description is ${description.length} characters`);
      if (canonical !== expectedCanonical) failures.push(`${path}: canonical ${canonical} != ${expectedCanonical}`);
      if (!robots.includes("index") || robots.includes("noindex") || !robots.includes("follow")) failures.push(`${path}: robots is ${robots}`);
      if (!googlebot.includes("index") || googlebot.includes("noindex") || !googlebot.includes("follow")) failures.push(`${path}: googlebot is ${googlebot}`);
      if (ogUrl !== expectedCanonical) failures.push(`${path}: og:url ${ogUrl} != ${expectedCanonical}`);
      if (!ogTitle) failures.push(`${path}: missing og:title`);
      if (!ogDescription) failures.push(`${path}: missing og:description`);
      if (twitterCard !== "summary_large_image") failures.push(`${path}: twitter:card is ${twitterCard}`);
      if (lang !== "en-ZA") failures.push(`${path}: html lang is ${lang}`);

      const previousPath = titles.get(title);
      if (previousPath && previousPath !== path) failures.push(`${path}: duplicate title with ${previousPath}: ${title}`);
      else titles.set(title, path);

      const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
      if (!structuredData.length) {
        failures.push(`${path}: missing JSON-LD`);
      } else {
        for (const json of structuredData) {
          try {
            JSON.parse(json);
          } catch {
            failures.push(`${path}: invalid JSON-LD`);
            break;
          }
        }
      }
    }

    expect(failures, failures.join("\n")).toEqual([]);
  });

  test("sitemap and robots expose one consistent production crawl surface", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(sitemap.headers()["content-type"]).toContain("application/xml");
    const xml = await sitemap.text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(urls.length).toBeGreaterThan(0);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) {
      expect(url.startsWith(`${SITE_URL}/`), `Unexpected sitemap origin: ${url}`).toBeTruthy();
      expect(url).not.toContain("?");
      expect(url).not.toContain("#");
      if (url !== `${SITE_URL}/`) expect(url.endsWith("/")).toBeFalsy();
    }

    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    const text = await robots.text();
    expect(text).toContain("User-agent: *");
    expect(text).toContain("Allow: /");
    expect(text).toContain(`Sitemap: ${SITE_URL}/sitemap.xml`);
  });

  test("canonical metadata ignores query strings and trailing slashes", async ({ page }) => {
    const response = await page.goto("/about/?utm_source=launch-audit#team", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE_URL}/about`);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", `${SITE_URL}/about`);
  });

  test("unknown pages return a not-found experience that search engines must not index", async ({ page }) => {
    const response = await page.goto("/this-page-must-not-exist-launch-audit", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex\s*,\s*follow/i);
    await expect(page.locator('meta[name="googlebot"]')).toHaveAttribute("content", /noindex\s*,\s*follow/i);
  });
});
