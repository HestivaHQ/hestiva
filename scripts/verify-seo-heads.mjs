import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { get } from "node:http";
import { setTimeout as delay } from "node:timers/promises";

const PRODUCTION_ORIGIN = "https://www.hestiva.co.za";
const SOCIAL_IMAGE = `${PRODUCTION_ORIGIN}/brand/social/social-share-1200x630.png`;
const LOCAL_ORIGIN = "http://127.0.0.1:8787";
const WRANGLER_CONFIG = ".output/server/wrangler.json";
const REQUEST_TIMEOUT_MS = 5_000;
const STARTUP_TIMEOUT_MS = 30_000;
const SHUTDOWN_TIMEOUT_MS = 5_000;
const INVALID_CASES = [
  "/services/not-a-real-service",
  "/locations/not-a-real-location",
  "/not-a-real-page",
];
const QUERY_CASES = ["/services/deep-cleaning?utm_source=test&utm_medium=seo"];

const REQUIRED_OPEN_GRAPH = {
  "og:title": null,
  "og:description": null,
  "og:type": "website",
  "og:url": null,
  "og:image": SOCIAL_IMAGE,
  "og:image:width": "1200",
  "og:image:height": "630",
  "og:image:alt": null,
  "og:site_name": "Hestiva",
  "og:locale": "en_ZA",
};

const REQUIRED_TWITTER = {
  "twitter:card": "summary_large_image",
  "twitter:title": null,
  "twitter:description": null,
  "twitter:image": SOCIAL_IMAGE,
  "twitter:image:alt": null,
};

const FORBIDDEN_SCHEMA_FIELDS = new Set([
  "aggregateRating",
  "review",
  "price",
  "priceRange",
  "openingHours",
  "openingHoursSpecification",
]);

function jsonLdObjects(html) {
  return [
    ...html.matchAll(
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ].map((match) => JSON.parse(match[1]));
}

function walk(value, visit) {
  if (!value || typeof value !== "object") return;
  visit(value);
  for (const child of Array.isArray(value) ? value : Object.values(value)) walk(child, visit);
}

function schemaEntities(schema) {
  return Array.isArray(schema["@graph"]) ? schema["@graph"] : [schema];
}

function verifyStructuredData(route, html) {
  const schemas = jsonLdObjects(html);
  assert.ok(schemas.length > 0, `${route}: expected structured data`);
  const entityKeys = new Set();

  for (const schema of schemas) {
    assert.equal(schema["@context"], "https://schema.org", `${route}: invalid @context`);
    for (const entity of schemaEntities(schema)) {
      const key = entity["@id"] && entity["@type"] && `${entity["@type"]}|${entity["@id"]}`;
      if (key) {
        assert.ok(!entityKeys.has(key), `${route}: duplicate schema entity ${key}`);
        entityKeys.add(key);
      }
    }

    walk(schema, (object) => {
      for (const field of Object.keys(object)) {
        assert.ok(!FORBIDDEN_SCHEMA_FIELDS.has(field), `${route}: forbidden schema field ${field}`);
      }
      for (const [field, value] of Object.entries(object)) {
        if (
          (field === "url" ||
            field === "item" ||
            field === "@id" ||
            field === "logo" ||
            field === "image") &&
          typeof value === "string"
        ) {
          const url = new URL(value);
          assert.equal(url.origin, PRODUCTION_ORIGIN, `${route}: schema URL has the wrong host`);
          assert.equal(url.search, "", `${route}: schema URL contains a query string`);
          if (field !== "@id")
            assert.equal(url.hash, "", `${route}: schema URL contains a fragment`);
        }
      }
    });
  }

  const entities = schemas.flatMap(schemaEntities);
  const types = entities.map((entity) => entity["@type"]);
  if (route === "/") {
    assert.ok(types.includes("WebSite"), `${route}: missing WebSite schema`);
    assert.ok(types.includes("HomeAndConstructionBusiness"), `${route}: missing business schema`);
  }
  if (route.startsWith("/services/")) {
    assert.ok(types.includes("Service"), `${route}: missing Service schema`);
  }
  if (/^\/(services|locations)(\/|$)/.test(route)) {
    const breadcrumb = entities.find((entity) => entity["@type"] === "BreadcrumbList");
    assert.ok(breadcrumb, `${route}: missing BreadcrumbList schema`);
    assert.deepEqual(
      breadcrumb.itemListElement.map((item) => item.position),
      breadcrumb.itemListElement.map((_, index) => index + 1),
      `${route}: breadcrumb positions are not consecutive`,
    );
  }

  const faq = entities.find((entity) => entity["@type"] === "FAQPage");
  assert.equal(
    Boolean(faq),
    /^\/(services|locations)\//.test(route) && route !== "/services/apartment-cleaning",
    `${route}: unexpected FAQPage presence`,
  );
  for (const question of faq?.mainEntity ?? []) {
    assert.ok(html.includes(question.name), `${route}: FAQ question is not visible`);
    assert.ok(html.includes(question.acceptedAnswer.text), `${route}: FAQ answer is not visible`);
  }
}

function metadataValues(html, selector) {
  const values = [];

  for (const match of html.matchAll(/<(?:link|meta)\b[^>]*>/gi)) {
    const attributes = Object.fromEntries(
      [...match[0].matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map((attribute) => [
        attribute[1].toLowerCase(),
        attribute[2] ?? attribute[3],
      ]),
    );

    if (selector(attributes)) {
      values.push(attributes.href ?? attributes.content);
    }
  }

  return values;
}

function request(path) {
  return new Promise((resolve, reject) => {
    const request = get(new URL(path, LOCAL_ORIGIN), (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => resolve({ body, status: response.statusCode ?? 0 }));
    });

    request.setTimeout(REQUEST_TIMEOUT_MS, () => {
      request.destroy(new Error(`Request timed out after ${REQUEST_TIMEOUT_MS}ms`));
    });
    request.on("error", reject);
  });
}

async function waitForRuntime(process, getStartupError) {
  const deadline = Date.now() + STARTUP_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const startupError = getStartupError();
    if (startupError) {
      throw startupError;
    }
    if (process.exitCode !== null) {
      throw new Error(`Wrangler exited before becoming ready (code ${process.exitCode})`);
    }

    try {
      const response = await request("/");
      if (response.status >= 200 && response.status < 500) {
        return;
      }
    } catch {
      // Wrangler is still starting.
    }

    await delay(250);
  }

  throw new Error(`Wrangler did not become ready within ${STARTUP_TIMEOUT_MS}ms`);
}

async function stopWrangler(process) {
  if (process.exitCode !== null) {
    return;
  }

  const signal = (name) => {
    if (globalThis.process.platform === "win32") {
      process.kill(name);
    } else if (process.pid) {
      globalThis.process.kill(-process.pid, name);
    }
  };

  const exited = new Promise((resolve) => process.once("exit", resolve));
  signal("SIGTERM");
  const result = await Promise.race([
    exited.then(() => "exited"),
    delay(SHUTDOWN_TIMEOUT_MS, "timeout"),
  ]);

  if (result === "timeout") {
    signal("SIGKILL");
    await Promise.race([exited, delay(1_000)]);
  }
}

function hrefPaths(html) {
  return [...html.matchAll(/<a\b[^>]*href=(?:"([^"]*)"|'([^']*)')/gi)]
    .map((match) => match[1] ?? match[2])
    .filter((href) => href.startsWith("/"))
    .map((href) => new URL(href, PRODUCTION_ORIGIN).pathname.replace(/\/$/, "") || "/");
}

async function verifyRoute(route, sitemapUrls) {
  const requestUrl = new URL(route, LOCAL_ORIGIN);
  const response = await request(requestUrl);
  assert.ok(
    response.status >= 200 && response.status < 300,
    `${route}: expected a successful response, received ${response.status}`,
  );

  const canonicals = metadataValues(response.body, (attributes) =>
    attributes.rel?.split(/\s+/).includes("canonical"),
  );
  const openGraphUrls = metadataValues(
    response.body,
    (attributes) => attributes.property === "og:url",
  );

  assert.equal(canonicals.length, 1, `${route}: expected exactly one canonical tag`);

  const robots = metadataValues(response.body, (attributes) => attributes.name === "robots");
  const googlebot = metadataValues(response.body, (attributes) => attributes.name === "googlebot");
  assert.deepEqual(robots, ["index, follow"], `${route}: invalid robots policy`);
  assert.deepEqual(googlebot, ["index, follow"], `${route}: invalid googlebot policy`);

  for (const [property, expectedValue] of Object.entries(REQUIRED_OPEN_GRAPH)) {
    const values = metadataValues(response.body, (attributes) => attributes.property === property);
    assert.equal(values.length, 1, `${route}: expected exactly one ${property} tag`);
    assert.ok(values[0], `${route}: ${property} must not be empty`);
    if (expectedValue !== null) {
      assert.equal(values[0], expectedValue, `${route}: ${property} has the wrong value`);
    }
  }

  const twitterValues = {};
  const twitterMetadata = metadataValues(response.body, (attributes) =>
    attributes.name?.startsWith("twitter:"),
  );
  assert.equal(
    twitterMetadata.length,
    Object.keys(REQUIRED_TWITTER).length,
    `${route}: expected only the complete Twitter card metadata set`,
  );
  for (const [name, expectedValue] of Object.entries(REQUIRED_TWITTER)) {
    const values = metadataValues(response.body, (attributes) => attributes.name === name);
    assert.equal(values.length, 1, `${route}: expected exactly one ${name} tag`);
    assert.ok(values[0], `${route}: ${name} must not be empty`);
    if (expectedValue !== null) {
      assert.equal(values[0], expectedValue, `${route}: ${name} has the wrong value`);
    }
    twitterValues[name] = values[0];
  }

  const twitterImage = new URL(twitterValues["twitter:image"]);
  assert.equal(twitterImage.protocol, "https:", `${route}: twitter:image must use HTTPS`);
  assert.equal(
    twitterImage.origin,
    PRODUCTION_ORIGIN,
    `${route}: twitter:image has the wrong host`,
  );
  assert.equal(twitterImage.search, "", `${route}: twitter:image must not contain a query string`);
  assert.equal(twitterImage.hash, "", `${route}: twitter:image must not contain a fragment`);

  const openGraphTitles = metadataValues(
    response.body,
    (attributes) => attributes.property === "og:title",
  );
  const openGraphDescriptions = metadataValues(
    response.body,
    (attributes) => attributes.property === "og:description",
  );
  const openGraphImageAlts = metadataValues(
    response.body,
    (attributes) => attributes.property === "og:image:alt",
  );
  assert.equal(
    twitterValues["twitter:title"],
    openGraphTitles[0],
    `${route}: twitter:title must match og:title`,
  );
  assert.equal(
    twitterValues["twitter:description"],
    openGraphDescriptions[0],
    `${route}: twitter:description must match og:description`,
  );
  assert.equal(
    twitterValues["twitter:image:alt"],
    openGraphImageAlts[0],
    `${route}: twitter:image:alt must match og:image:alt`,
  );

  assert.equal(openGraphUrls.length, 1, `${route}: expected exactly one og:url tag`);
  assert.equal(canonicals[0], openGraphUrls[0], `${route}: canonical and og:url must match`);

  const canonical = new URL(canonicals[0]);
  const expectedPath = requestUrl.pathname === "/" ? "/" : requestUrl.pathname.replace(/\/+$/, "");
  assert.equal(canonical.origin, PRODUCTION_ORIGIN, `${route}: canonical has the wrong host`);
  assert.equal(canonical.search, "", `${route}: canonical must not contain a query string`);
  assert.equal(canonical.hash, "", `${route}: canonical must not contain a fragment`);
  assert.equal(canonical.pathname, expectedPath, `${route}: canonical path is not normalized`);
  assert.equal(
    sitemapUrls.has(canonical.href),
    true,
    `${route}: canonical is missing from the sitemap`,
  );

  verifyStructuredData(requestUrl.pathname, response.body);

  console.log(
    `INDEXABLE | ${route} | HTTP ${response.status} | robots=${robots[0]} | canonical=${canonical.href} | sitemap=yes | expected=200/index/self-canonical | PASS`,
  );
  return { canonical: canonical.href, links: hrefPaths(response.body) };
}

async function verifyInvalidRoute(route, sitemapUrls) {
  const response = await request(route);
  const robots = metadataValues(response.body, (attributes) => attributes.name === "robots");
  const canonicals = metadataValues(response.body, (attributes) =>
    attributes.rel?.split(/\s+/).includes("canonical"),
  );
  assert.equal(response.status, 404, `${route}: expected HTTP 404`);
  assert.deepEqual(robots, ["noindex, follow"], `${route}: expected one noindex directive`);
  assert.equal(canonicals.length, 0, `${route}: 404 must not claim a canonical URL`);
  assert.equal(
    sitemapUrls.has(`${PRODUCTION_ORIGIN}${route}`),
    false,
    `${route}: found in sitemap`,
  );
  console.log(
    `NOT_FOUND_OR_INVALID | ${route} | HTTP 404 | robots=${robots[0]} | canonical=none | sitemap=no | expected=404/noindex/no-canonical | PASS`,
  );
}

async function loadPolicy() {
  const [sitemap, robots] = await Promise.all([request("/sitemap.xml"), request("/robots.txt")]);
  assert.equal(sitemap.status, 200, "sitemap: expected HTTP 200");
  assert.match(sitemap.body, /<urlset\b/, "sitemap: missing urlset");
  const urls = [...sitemap.body.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  assert.equal(new Set(urls).size, urls.length, "sitemap: duplicate URL");
  for (const value of urls) {
    const url = new URL(value);
    assert.equal(url.origin, PRODUCTION_ORIGIN, `sitemap: wrong origin in ${value}`);
    assert.equal(url.search, "", `sitemap: query string in ${value}`);
    assert.equal(url.hash, "", `sitemap: fragment in ${value}`);
    assert.ok(
      url.pathname === "/" || !url.pathname.endsWith("/"),
      `sitemap: trailing slash in ${value}`,
    );
  }
  assert.equal(robots.status, 200, "robots.txt: expected HTTP 200");
  assert.match(robots.body, /User-agent:\s*\*/i, "robots.txt: missing general user agent");
  assert.match(robots.body, /Allow:\s*\//i, "robots.txt: indexable pages are not allowed");
  assert.match(
    robots.body,
    new RegExp(`Sitemap:\\s*${PRODUCTION_ORIGIN.replaceAll(".", "\\.")}\\/sitemap\\.xml`, "i"),
    "robots.txt: sitemap declaration is missing or incorrect",
  );
  console.log(
    `NON_HTML_TECHNICAL | /robots.txt | HTTP 200 | robots=n/a | canonical=n/a | sitemap=no | expected=crawl policy | PASS`,
  );
  console.log(
    `NON_HTML_TECHNICAL | /sitemap.xml | HTTP 200 | robots=n/a | canonical=n/a | sitemap=no | expected=unique indexable URLs | PASS`,
  );
  return new Set(urls);
}

await access(WRANGLER_CONFIG).catch(() => {
  throw new Error(`Missing ${WRANGLER_CONFIG}; run \`bun run build\` before this verifier`);
});

let startupError;
const wrangler = spawn(
  process.platform === "win32" ? "node_modules/.bin/wrangler.cmd" : "node_modules/.bin/wrangler",
  ["dev", "--config", WRANGLER_CONFIG, "--ip", "127.0.0.1", "--port", "8787"],
  {
    detached: process.platform !== "win32",
    stdio: ["ignore", "inherit", "inherit"],
  },
);
wrangler.once("error", (error) => {
  startupError = error;
});

try {
  await waitForRuntime(wrangler, () => startupError);
  const sitemapUrls = await loadPolicy();
  const routes = [...sitemapUrls].map((url) => new URL(url).pathname);
  const inboundLinks = new Map(routes.map((route) => [route, 0]));
  for (const route of [...routes, ...QUERY_CASES]) {
    const result = await verifyRoute(route, sitemapUrls);
    if (!route.includes("?")) {
      for (const link of new Set(result.links)) {
        if (link !== route && inboundLinks.has(link))
          inboundLinks.set(link, inboundLinks.get(link) + 1);
      }
    }
  }
  for (const route of INVALID_CASES) await verifyInvalidRoute(route, sitemapUrls);
  const orphans = [...inboundLinks].filter(([route, count]) => route !== "/" && count === 0);
  assert.deepEqual(
    orphans,
    [],
    `Orphaned indexable routes: ${orphans.map(([route]) => route).join(", ")}`,
  );
  console.log(
    `ORPHAN AUDIT | ${routes.length} indexable routes | expected=inbound internal link | PASS`,
  );
} finally {
  await stopWrangler(wrangler);
}
