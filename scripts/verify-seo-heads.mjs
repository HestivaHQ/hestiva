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
const ROUTES = [
  "/",
  "/about",
  "/contact",
  "/quote",
  "/privacy",
  "/terms",
  "/services",
  "/services/regular-home-cleaning",
  "/services/deep-cleaning",
  "/services/move-in-cleaning",
  "/services/move-out-cleaning",
  "/services/kitchen-cleaning",
  "/services/bathroom-sanitisation",
  "/services/bedroom-cleaning",
  "/services/living-area-cleaning",
  "/services/interior-window-cleaning",
  "/services/laundry-folding",
  "/services/apartment-cleaning",
  "/services/eco-conscious-cleaning",
  "/services/cleaning-add-ons",
  "/locations",
  "/locations/johannesburg",
  "/locations/pretoria",
  "/locations/centurion",
  "/locations/midrand",
  "/locations/kempton-park",
  "/locations/randburg",
  "/locations/roodepoort",
  "/locations/boksburg",
  "/locations/benoni",
  "/locations/edenvale",
  "/locations/germiston",
  "/locations/sandton",
  "/services/deep-cleaning?utm_source=test&utm_medium=seo",
];

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

async function verifyRoute(route) {
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

  for (const [property, expectedValue] of Object.entries(REQUIRED_OPEN_GRAPH)) {
    const values = metadataValues(response.body, (attributes) => attributes.property === property);
    assert.equal(values.length, 1, `${route}: expected exactly one ${property} tag`);
    assert.ok(values[0], `${route}: ${property} must not be empty`);
    if (expectedValue !== null) {
      assert.equal(values[0], expectedValue, `${route}: ${property} has the wrong value`);
    }
  }

  assert.equal(openGraphUrls.length, 1, `${route}: expected exactly one og:url tag`);
  assert.equal(canonicals[0], openGraphUrls[0], `${route}: canonical and og:url must match`);

  const canonical = new URL(canonicals[0]);
  const expectedPath = requestUrl.pathname === "/" ? "/" : requestUrl.pathname.replace(/\/+$/, "");
  assert.equal(canonical.origin, PRODUCTION_ORIGIN, `${route}: canonical has the wrong host`);
  assert.equal(canonical.search, "", `${route}: canonical must not contain a query string`);
  assert.equal(canonical.hash, "", `${route}: canonical must not contain a fragment`);
  assert.equal(canonical.pathname, expectedPath, `${route}: canonical path is not normalized`);

  console.log(`PASS ${route} -> ${canonical.href}`);
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
  for (const route of ROUTES) {
    await verifyRoute(route);
  }
} finally {
  await stopWrangler(wrangler);
}
