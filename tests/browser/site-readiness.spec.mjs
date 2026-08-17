import { expect, test } from "@playwright/test";

async function sitemapPaths(request) {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBeTruthy();
  const xml = await response.text();
  const paths = [...xml.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((match) => match[1] || "/");
  expect(paths.length).toBeGreaterThan(0);
  return [...new Set(paths)];
}

function normaliseInternalHref(href) {
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) {
    return null;
  }
  try {
    const url = new URL(href, "http://127.0.0.1:4173");
    if (url.origin !== "http://127.0.0.1:4173") return null;
    return `${url.pathname}${url.search}`;
  } catch {
    return null;
  }
}

test.describe("whole-site readiness", () => {
  test("every sitemap page loads cleanly with one visible primary heading and no horizontal overflow", async ({ page, request }) => {
    test.setTimeout(180_000);
    const paths = await sitemapPaths(request);
    const failures = [];

    for (const path of paths) {
      const consoleErrors = [];
      const pageErrors = [];
      const onConsole = (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      };
      const onPageError = (error) => pageErrors.push(error.message);
      page.on("console", onConsole);
      page.on("pageerror", onPageError);

      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle").catch(() => {});

      if (!response || response.status() >= 400) failures.push(`${path}: HTTP ${response?.status() ?? "no response"}`);

      const h1s = page.locator("h1");
      const h1Count = await h1s.count();
      if (h1Count !== 1 || !(await h1s.first().isVisible().catch(() => false))) {
        failures.push(`${path}: expected one visible h1, found ${h1Count}`);
      }

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      if (overflow.scrollWidth > overflow.clientWidth + 1) {
        failures.push(`${path}: horizontal overflow ${overflow.scrollWidth}px > ${overflow.clientWidth}px`);
      }

      if (consoleErrors.length) failures.push(`${path}: console errors: ${consoleErrors.join(" | ")}`);
      if (pageErrors.length) failures.push(`${path}: page errors: ${pageErrors.join(" | ")}`);

      page.off("console", onConsole);
      page.off("pageerror", onPageError);
    }

    expect(failures, failures.join("\n")).toEqual([]);
  });

  test("internal links exposed by sitemap pages resolve without broken HTTP responses", async ({ page, request }) => {
    test.setTimeout(180_000);
    const paths = await sitemapPaths(request);
    const hrefs = new Set();

    for (const path of paths) {
      const response = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(response?.status(), `${path} should load before link extraction`).toBeLessThan(400);
      const pageHrefs = await page.locator("a[href]").evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute("href")));
      for (const href of pageHrefs) {
        const internal = normaliseInternalHref(href);
        if (internal) hrefs.add(internal);
      }
    }

    const failures = [];
    for (const href of hrefs) {
      const response = await request.get(href, { maxRedirects: 5 });
      if (response.status() >= 400) failures.push(`${href}: HTTP ${response.status()}`);
    }

    expect(failures, failures.join("\n")).toEqual([]);
  });

  test("core customer navigation exposes working quote, services, contact and legal destinations", async ({ page }) => {
    await page.goto("/");

    for (const destination of ["/quote", "/services", "/contact", "/faq", "/privacy", "/terms"]) {
      const links = page.locator(`a[href='${destination}']`);
      await expect(links.first(), `Expected customer navigation to expose ${destination}`).toBeVisible();
    }
  });
});
