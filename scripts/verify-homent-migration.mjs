import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const ACTIVE_ROOTS = ["src", "public"];
const TEXT_EXTENSIONS = new Set([
  ".css",
  ".html",
  ".js",
  ".jsx",
  ".json",
  ".mjs",
  ".svg",
  ".ts",
  ".tsx",
  ".txt",
  ".xml",
]);
const LEGACY_DOMAIN = "hestiva.co.za";
const LEGACY_EMAIL_SUFFIX = "@hestiva.co.za";
const PRODUCTION_ORIGIN = "https://www.homent.co.za";

async function collectTextFiles(root) {
  const files = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    const current = path.join(root, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectTextFiles(current)));
      continue;
    }
    if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(current);
    }
  }
  return files;
}

async function verifyNoLegacyPublicReferences() {
  const offenders = [];
  for (const root of ACTIVE_ROOTS) {
    for (const file of await collectTextFiles(root)) {
      const content = await readFile(file, "utf8");
      if (content.toLowerCase().includes(LEGACY_DOMAIN)) offenders.push(file);
      if (content.toLowerCase().includes(LEGACY_EMAIL_SUFFIX) && !offenders.includes(file)) {
        offenders.push(file);
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `Legacy Hestiva domain/email references remain in active public source: ${offenders.join(", ")}`,
  );
}

async function verifyCanonicalHomentConfiguration() {
  const site = await readFile("src/lib/site.ts", "utf8");
  const robots = await readFile("public/robots.txt", "utf8");
  const llms = await readFile("public/llms.txt", "utf8");

  assert.match(site, /SITE_NAME\s*=\s*["']Homent["']/, "SITE_NAME must remain Homent");
  assert.ok(site.includes(PRODUCTION_ORIGIN), "SITE_URL must remain on the canonical Homent origin");
  assert.ok(
    robots.includes(`${PRODUCTION_ORIGIN}/sitemap.xml`),
    "robots.txt must advertise the canonical Homent sitemap",
  );
  assert.ok(llms.includes(PRODUCTION_ORIGIN), "llms.txt must reference the canonical Homent origin");
}

await verifyNoLegacyPublicReferences();
await verifyCanonicalHomentConfiguration();
console.log("Homent migration verification passed.");
