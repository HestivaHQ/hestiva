import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import { get } from "node:http";
import { setTimeout as delay } from "node:timers/promises";

const PRODUCTION_ORIGIN = "https://www.homent.co.za";
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
const TRAILING_SLASH_CASES = ["/services/deep-cleaning/", "/locations/sandton/"];
const STATIC_BREADCRUMB_LABELS = new Map([
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/quote", "Quote"],
  ["/privacy", "Privacy Policy"],
  ["/terms", "Terms of Service"],
  ["/services", "Services"],
  ["/locations", "Locations"],
]);

const REQUIRED_OPEN_GRAPH = {
  "og:title": null,
  "og:description": null,
  "og:type": "website",
  "og:url": null,
  "og:image": SOCIAL_IMAGE,
  "og:image:width": "1200",
  "og:image:height": "630",
  "og:image:alt": null,
  "og:site_name": "Homent",
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
  if (route !== "/") {
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

function breadcrumbItemsFromHtml(route, html) {
  const navs = [...html.matchAll(/<nav\b([^>]*)>([\s\S]*?)<\/nav>/gi)].filter(
    (match) => attributeValue(match[1], "aria-label")?.toLowerCase() === "breadcrumb",
  );

  if (route === "/") {
    assert.equal(navs.length, 0, `${route}: homepage must not render a breadcrumb`);
    return [];
  }

  assert.equal(navs.length, 1, `${route}: expected exactly one visible breadcrumb`);
  assert.equal(
    [...navs[0][2].matchAll(/\baria-current\s*=\s*(?:["']page["'])/gi)].length,
    1,
    `${route}: expected exactly one aria-current=\"page\" in the breadcrumb`,
  );
  const items = [...navs[0][2].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map((match) => {
    const anchor = match[1].match(/<a\b([^>]*)>([\s\S]*?)<\/a>/i);
    return {
      label: decodeAccessibleText(anchor?.[2] ?? match[1]),
      href: anchor ? attributeValue(anchor[1], "href") : undefined,
      current: /aria-current=(?:"page"|'page')/i.test(match[1]),
    };
  });
  assert.ok(items.length > 0, `${route}: breadcrumb has no list items`);
  return items;
}

function expectedBreadcrumbPaths(route) {
  if (route === "/") return [];
  if (route.startsWith("/services/")) return ["/", "/services", route];
  if (route.startsWith("/locations/")) return ["/", "/locations", route];
  return ["/", route];
}

function verifyBreadcrumbs(route, html) {
  const visible = breadcrumbItemsFromHtml(route, html);
  const entities = jsonLdObjects(html).flatMap(schemaEntities);
  const schemas = entities.filter((entity) => entity["@type"] === "BreadcrumbList");

  if (route === "/") {
    assert.equal(schemas.length, 0, `${route}: homepage must not emit BreadcrumbList schema`);
    return;
  }

  assert.equal(schemas.length, 1, `${route}: expected exactly one BreadcrumbList schema`);
  const structured = schemas[0].itemListElement;
  const expectedPaths = expectedBreadcrumbPaths(route);
  assert.equal(
    visible.length,
    expectedPaths.length,
    `${route}: breadcrumb hierarchy is incomplete`,
  );
  assert.equal(structured.length, expectedPaths.length, `${route}: schema hierarchy is incomplete`);
  assert.equal(
    new Set(structured.map((item) => item.position)).size,
    structured.length,
    `${route}: duplicate breadcrumb positions`,
  );

  const currentItems = visible.filter((item) => item.current);
  assert.equal(currentItems.length, 1, `${route}: expected exactly one current breadcrumb item`);
  assert.equal(visible.at(-1).current, true, `${route}: only the final breadcrumb may be current`);
  assert.equal(visible.at(-1).href, undefined, `${route}: current breadcrumb must not be linked`);

  visible.forEach((item, index) => {
    const schemaItem = structured[index];
    const expectedUrl = new URL(expectedPaths[index], PRODUCTION_ORIGIN);
    assert.equal(item.label, schemaItem.name, `${route}: visible and structured labels differ`);
    assert.equal(
      schemaItem.position,
      index + 1,
      `${route}: breadcrumb positions are not consecutive`,
    );
    assert.equal(
      schemaItem.item,
      expectedUrl.href,
      `${route}: structured breadcrumb URL is not canonical`,
    );
    if (index < visible.length - 1) {
      const href = new URL(item.href, PRODUCTION_ORIGIN);
      assert.equal(
        href.href,
        expectedUrl.href,
        `${route}: visible breadcrumb URL is not canonical`,
      );
      assert.equal(href.search, "", `${route}: breadcrumb URL contains a query string`);
      assert.equal(href.hash, "", `${route}: breadcrumb URL contains a fragment`);
    }
  });

  assert.equal(visible[0].label, "Home", `${route}: breadcrumb must begin at Home`);
  if (route.startsWith("/services/")) assert.equal(visible[1].label, "Services");
  if (route.startsWith("/locations/")) assert.equal(visible[1].label, "Locations");
  if (STATIC_BREADCRUMB_LABELS.has(route)) {
    assert.equal(
      visible.at(-1).label,
      STATIC_BREADCRUMB_LABELS.get(route),
      `${route}: current breadcrumb label is incorrect`,
    );
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

function decodeText(value) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeAccessibleText(value) {
  return decodeText(
    value.replace(
      /<([a-z][\w:-]*)\b[^>]*\baria-hidden\s*=\s*(?:["']true["'])[^>]*>[\s\S]*?<\/\1>/gi,
      "",
    ),
  );
}

function attributeValue(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  return match?.[1] ?? match?.[2];
}

function verifyOnPageSeo(route, html) {
  const titles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((match) =>
    decodeText(match[1]),
  );
  assert.equal(titles.length, 1, `${route}: expected exactly one page title`);
  assert.ok(
    titles[0].length >= 20 && titles[0].length <= 65,
    `${route}: title length is unsuitable`,
  );
  assert.match(titles[0], /Homent/i, `${route}: title is missing consistent branding`);

  const descriptions = metadataValues(
    html,
    (attributes) => attributes.name?.toLowerCase() === "description",
  );
  assert.equal(descriptions.length, 1, `${route}: expected exactly one meta description`);
  assert.ok(
    descriptions[0].length >= 70 && descriptions[0].length <= 160,
    `${route}: meta description length is unsuitable (${descriptions[0].length})`,
  );

  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((match) => ({
    level: Number(match[1]),
    text: decodeText(match[2]),
  }));
  assert.ok(headings.length > 0, `${route}: expected visible headings`);
  assert.ok(
    headings.every(({ text }) => text.length > 0),
    `${route}: empty heading found`,
  );
  const h1s = headings.filter(({ level }) => level === 1);
  assert.equal(h1s.length, 1, `${route}: expected exactly one H1`);
  for (let index = 1; index < headings.length; index += 1) {
    assert.ok(
      headings[index].level <= headings[index - 1].level + 1,
      `${route}: heading level skips from H${headings[index - 1].level} to H${headings[index].level}`,
    );
  }

  for (const image of html.matchAll(/<img\b[^>]*>/gi)) {
    const alt = attributeValue(image[0], "alt");
    assert.notEqual(alt, undefined, `${route}: image is missing an alt attribute`);
    if (alt) {
      assert.ok(decodeText(alt).length >= 5, `${route}: image alt text is not descriptive`);
      assert.doesNotMatch(
        decodeText(alt),
        /^(image|photo|picture|placeholder|logo\.(?:png|jpe?g|webp))$/i,
        `${route}: image has generic alt text`,
      );
    }
  }

  const genericAnchors = /^(click here|here|read more|learn more|more)$/i;
  for (const anchor of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const label = attributeValue(anchor[1], "aria-label");
    const imageAlt = [...anchor[2].matchAll(/<img\b[^>]*>/gi)]
      .map((image) => attributeValue(image[0], "alt"))
      .filter(Boolean)
      .join(" ");
    const text = decodeText(label || anchor[2]) || decodeText(imageAlt);
    assert.ok(text.length > 0, `${route}: link has no descriptive accessible text`);
    assert.doesNotMatch(text, genericAnchors, `${route}: generic link text "${text}" found`);
  }

  return { title: titles[0], description: descriptions[0], h1: h1s[0].text };
}

function request(path) {
  return new Promise((resolve, reject) => {
    const request = get(new URL(path, LOCAL_ORIGIN), (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () =>
        resolve({ body, headers: response.headers, status: response.statusCode ?? 0 }),
      );
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

function internalLinks(route, html) {
  const breadcrumbRanges = [
    ...html.matchAll(/<nav\b[^>]*aria-label=(?:"breadcrumb"|'breadcrumb')[^>]*>[\s\S]*?<\/nav>/gi),
  ].map((match) => [match.index, match.index + match[0].length]);
  const links = [];

  for (const anchor of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const href = attributeValue(anchor[1], "href");
    const absoluteInternalHost = href?.match(/^(?:https?:)?\/\/([^/?#]+)(?:[/?#]|$)/i)?.[1];
    if (absoluteInternalHost?.replace(/^www\./i, "") === "homent.co.za") {
      assert.ok(
        href.startsWith(PRODUCTION_ORIGIN),
        `${route}: internal link uses a non-canonical host: ${href}`,
      );
    }
    if (
      !href ||
      (/^(?:mailto:|tel:|https?:\/\/)/i.test(href) && !href.startsWith(PRODUCTION_ORIGIN))
    )
      continue;
    assert.doesNotMatch(
      href,
      /^(?:javascript|data|file):/i,
      `${route}: malformed internal href "${href}"`,
    );

    let url;
    try {
      url = new URL(href, PRODUCTION_ORIGIN);
    } catch {
      assert.fail(`${route}: malformed internal href "${href}"`);
    }
    if (url.origin !== PRODUCTION_ORIGIN) continue;
    assert.equal(url.search, "", `${route}: internal link contains a query string: ${href}`);
    assert.ok(
      url.pathname === "/" || !url.pathname.endsWith("/"),
      `${route}: internal link has a trailing slash: ${href}`,
    );
    assert.ok(
      !/^https?:\/\//i.test(href) || href.startsWith(PRODUCTION_ORIGIN),
      `${route}: internal link uses a non-canonical host: ${href}`,
    );
    assert.doesNotMatch(
      anchor[1],
      /(?:\bhidden\b|aria-hidden=(?:"true"|'true')|style=(?:"[^"]*display\s*:\s*none|'[^']*display\s*:\s*none))/i,
      `${route}: hidden internal link found: ${href}`,
    );

    const label = decodeAccessibleText(attributeValue(anchor[1], "aria-label") || anchor[2]);
    assert.doesNotMatch(
      label,
      /^(?:click here|here|read more|learn more|view service|more|go)$/i,
      `${route}: generic internal anchor "${label}" found`,
    );
    const path = url.pathname.replace(/\/$/, "") || "/";
    links.push({
      href,
      path,
      fragment: url.hash,
      label,
      breadcrumb: breadcrumbRanges.some(
        ([start, end]) => anchor.index >= start && anchor.index < end,
      ),
    });
  }

  for (const section of html.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/gi)) {
    const identities = [...section[1].matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
      .map((anchor) => {
        const href = attributeValue(anchor[1], "href");
        const label = decodeAccessibleText(attributeValue(anchor[1], "aria-label") || anchor[2]);
        return href?.startsWith("/") ? `${href}|${label}` : undefined;
      })
      .filter(Boolean);
    assert.equal(
      new Set(identities).size,
      identities.length,
      `${route}: repeated identical internal links found in one content section`,
    );
  }

  return links;
}

async function verifyRoute(route, sitemapUrls) {
  const requestUrl = new URL(route, LOCAL_ORIGIN);
  const expectedPath = requestUrl.pathname === "/" ? "/" : requestUrl.pathname.replace(/\/+$/, "");
  const response = await request(requestUrl);
  assert.ok(
    response.status >= 200 && response.status < 300,
    `${route}: expected a successful response, received ${response.status}`,
  );
  verifyBreadcrumbs(expectedPath, response.body);

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
  assert.equal(canonical.origin, PRODUCTION_ORIGIN, `${route}: canonical has the wrong host`);
  assert.equal(canonical.search, "", `${route}: canonical must not contain a query string`);
  assert.equal(canonical.hash, "", `${route}: canonical must not contain a fragment`);
  assert.equal(canonical.pathname, expectedPath, `${route}: canonical path is not normalized`);
  assert.equal(
    sitemapUrls.has(canonical.href),
    true,
    `${route}: canonical is missing from the sitemap`,
  );

  verifyStructuredData(expectedPath, response.body);
  const onPage = verifyOnPageSeo(route, response.body);

  console.log(
    `INDEXABLE | ${route} | HTTP ${response.status} | robots=${robots[0]} | canonical=${canonical.href} | sitemap=yes | expected=200/index/self-canonical | PASS`,
  );
  return { canonical: canonical.href, links: internalLinks(route, response.body), onPage };
}

async function verifyInvalidRoute(route, sitemapUrls) {
  const response = await request(route);
  const robots = metadataValues(response.body, (attributes) => attributes.name === "robots");
  const canonicals = metadataValues(response.body, (attributes) =>
    attributes.rel?.split(/\s+/).includes("canonical"),
  );
  const googlebot = metadataValues(response.body, (attributes) => attributes.name === "googlebot");
  assert.equal(response.status, 404, `${route}: expected HTTP 404`);
  assert.deepEqual(robots, ["noindex, follow"], `${route}: expected one noindex directive`);
  assert.deepEqual(
    googlebot,
    ["noindex, follow"],
    `${route}: expected one matching Googlebot noindex directive`,
  );
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

async function verifyTrailingSlashRoute(route, sitemapUrls) {
  const response = await request(route);
  assert.ok(
    [301, 307, 308].includes(response.status),
    `${route}: expected a permanent or method-preserving canonical redirect`,
  );
  const expectedPath = route.replace(/\/+$/, "") || "/";
  const location = new URL(response.headers.location ?? "", LOCAL_ORIGIN);
  assert.equal(location.origin, LOCAL_ORIGIN, `${route}: redirect must stay on the same origin`);
  assert.equal(location.pathname, expectedPath, `${route}: redirect target is not canonical`);
  assert.equal(location.search, "", `${route}: redirect target contains a query string`);
  assert.equal(location.hash, "", `${route}: redirect target contains a fragment`);
  await verifyRoute(expectedPath, sitemapUrls);
  console.log(
    `NORMALIZATION | ${route} | HTTP ${response.status} | target=${expectedPath} | expected=single-hop canonical redirect | PASS`,
  );
}

async function loadPolicy() {
  const [sitemap, robots, llms] = await Promise.all([
    request("/sitemap.xml"),
    request("/robots.txt"),
    request("/llms.txt"),
  ]);
  assert.equal(sitemap.status, 200, "sitemap: expected HTTP 200");
  assert.match(
    sitemap.headers["content-type"] ?? "",
    /(?:application|text)\/xml/i,
    "sitemap: expected an XML content type",
  );
  assert.match(
    sitemap.body,
    /<urlset\b[^>]*xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']/,
    "sitemap: missing the standard sitemap namespace",
  );
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
  assert.match(
    robots.headers["content-type"] ?? "",
    /^text\/plain\b/i,
    "robots.txt: expected a text/plain content type",
  );
  assert.match(robots.body, /User-agent:\s*\*/i, "robots.txt: missing general user agent");
  assert.match(robots.body, /Allow:\s*\//i, "robots.txt: indexable pages are not allowed");
  assert.match(
    robots.body,
    new RegExp(`Sitemap:\\s*${PRODUCTION_ORIGIN.replaceAll(".", "\\.")}\\/sitemap\\.xml`, "i"),
    "robots.txt: sitemap declaration is missing or incorrect",
  );
  assert.equal(
    [...robots.body.matchAll(/^\s*Sitemap\s*:/gim)].length,
    1,
    "robots.txt: expected exactly one sitemap declaration",
  );
  assert.doesNotMatch(
    robots.body,
    /^\s*Disallow\s*:\s*\/(?:assets|_build|build|src|public)(?:\/|\s|$)/gim,
    "robots.txt: rendering assets must not be blocked",
  );
  assert.equal(llms.status, 200, "llms.txt: expected HTTP 200");
  assert.match(llms.body, new RegExp(PRODUCTION_ORIGIN), "llms.txt: production origin is missing");
  assert.doesNotMatch(llms.body, /https:\/\/(?:www\.)?hestiva\.co\.za/i, "llms.txt: legacy Hestiva origin found");
  for (const match of llms.body.matchAll(/\[[^\]]+\]\((\/[^)#?]*)(?:[?#][^)]*)?\)/g)) {
    const href = new URL(match[1], PRODUCTION_ORIGIN).href;
    assert.ok(
      urls.includes(href) || href === `${PRODUCTION_ORIGIN}/sitemap.xml`,
      `llms.txt: link is not an indexable route: ${match[1]}`,
    );
  }
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
  const outboundLinks = new Map(routes.map((route) => [route, 0]));
  const contextualLinksByRoute = new Map();
  const discoveredTargets = new Map();
  const onPageResults = [];
  for (const route of routes) {
    const result = await verifyRoute(route, sitemapUrls);
    if (!route.includes("?")) {
      onPageResults.push({ route, ...result.onPage });
      const contextualPaths = new Set(
        result.links.filter((link) => !link.breadcrumb).map((link) => link.path),
      );
      contextualLinksByRoute.set(route, contextualPaths);
      outboundLinks.set(route, contextualPaths.size);
      for (const link of result.links) {
        if (!link.fragment) discoveredTargets.set(link.path, link.href);
      }
      for (const link of contextualPaths) {
        if (link !== route && inboundLinks.has(link))
          inboundLinks.set(link, inboundLinks.get(link) + 1);
      }
    }
  }
  for (const route of QUERY_CASES) {
    await verifyRoute(route, sitemapUrls);
  }
  for (const route of TRAILING_SLASH_CASES) {
    await verifyTrailingSlashRoute(route, sitemapUrls);
  }
  for (const [path, href] of discoveredTargets) {
    assert.ok(
      sitemapUrls.has(`${PRODUCTION_ORIGIN}${path}`),
      `Internal link is not an indexable route: ${href}`,
    );
    const response = await request(path);
    assert.ok(
      response.status >= 200 && response.status < 300,
      `Broken or redirecting internal link ${href}: received HTTP ${response.status}`,
    );
  }
  for (const route of INVALID_CASES) await verifyInvalidRoute(route, sitemapUrls);
  for (const route of routes.filter((path) => path.startsWith("/services/"))) {
    assert.ok(
      contextualLinksByRoute.get("/services").has(route),
      `${route}: missing meaningful navigation from /services`,
    );
  }
  for (const route of routes.filter((path) => path.startsWith("/locations/"))) {
    assert.ok(
      contextualLinksByRoute.get("/locations").has(route),
      `${route}: missing meaningful navigation from /locations`,
    );
  }
  const orphans = [...inboundLinks].filter(([route, count]) => route !== "/" && count === 0);
  assert.deepEqual(
    orphans,
    [],
    `Orphaned indexable routes: ${orphans.map(([route]) => route).join(", ")}`,
  );
  for (const field of ["title", "description", "h1"]) {
    const values = onPageResults.map((result) => result[field].toLocaleLowerCase("en-ZA"));
    const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
    assert.equal(
      new Set(values).size,
      values.length,
      `Duplicate ${field} values found across indexable routes: ${[...new Set(duplicates)].join(", ")}`,
    );
  }
  console.log(
    `ON-PAGE AUDIT | ${routes.length} indexable routes | expected=unique title/description/H1, one H1, valid headings/images/anchors | PASS`,
  );
  console.log(
    `ORPHAN AUDIT | ${routes.length} indexable routes | expected=inbound internal link | PASS`,
  );
  console.log(
    `INTERNAL LINK AUDIT | ${routes.length} routes | ${discoveredTargets.size} destinations | broken=0 | non-canonical=0 | generic=0 | PASS`,
  );
  for (const route of routes) {
    console.log(
      `LINK GRAPH | ${route} | inbound=${inboundLinks.get(route)} | outbound=${outboundLinks.get(route)} | PASS`,
    );
  }
} finally {
  await stopWrangler(wrangler);
}
