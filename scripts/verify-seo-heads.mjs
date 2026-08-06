import { spawn } from "node:child_process";

const host = "127.0.0.1";
const port = 4173;
const previewOrigin = `http://${host}:${port}`;
const canonicalOrigin = "https://www.hestiva.co.za";

const checks = [
  { requestPath: "/", canonicalPath: "/" },
  {
    requestPath: "/services/deep-cleaning",
    canonicalPath: "/services/deep-cleaning",
  },
  {
    requestPath: "/locations/randburg",
    canonicalPath: "/locations/randburg",
  },
  {
    requestPath: "/services/deep-cleaning?utm_source=seo-check#pricing",
    canonicalPath: "/services/deep-cleaning",
  },
];

function extractAttributeTags(html, pattern) {
  return [...html.matchAll(pattern)].map((match) => match[1]);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

async function waitForServer(timeoutMs = 30_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(previewOrigin, { redirect: "manual" });
      if (response.status < 500) return;
    } catch {
      // Preview server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Preview server did not start within ${timeoutMs}ms.`);
}

async function verifyPage({ requestPath, canonicalPath }) {
  const response = await fetch(`${previewOrigin}${requestPath}`);
  assertEqual(response.status, 200, `Unexpected response for ${requestPath}`);

  const html = await response.text();
  const expectedCanonical = `${canonicalOrigin}${canonicalPath}`;

  const canonicals = extractAttributeTags(
    html,
    /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["'][^>]*>/gi,
  );
  const reversedCanonicals = extractAttributeTags(
    html,
    /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']canonical["'][^>]*>/gi,
  );
  const allCanonicals = [...canonicals, ...reversedCanonicals];

  assertEqual(
    allCanonicals.length,
    1,
    `Expected exactly one canonical tag for ${requestPath}`,
  );
  assertEqual(
    allCanonicals[0],
    expectedCanonical,
    `Incorrect canonical URL for ${requestPath}`,
  );

  const ogUrls = extractAttributeTags(
    html,
    /<meta\b[^>]*\bproperty=["']og:url["'][^>]*\bcontent=["']([^"']+)["'][^>]*>/gi,
  );
  const reversedOgUrls = extractAttributeTags(
    html,
    /<meta\b[^>]*\bcontent=["']([^"']+)["'][^>]*\bproperty=["']og:url["'][^>]*>/gi,
  );
  const allOgUrls = [...ogUrls, ...reversedOgUrls];

  assertEqual(allOgUrls.length, 1, `Expected exactly one og:url for ${requestPath}`);
  assertEqual(allOgUrls[0], expectedCanonical, `Incorrect og:url for ${requestPath}`);

  console.log(`✓ ${requestPath} -> ${expectedCanonical}`);
}

const preview = spawn(
  "bun",
  ["run", "preview", "--", "--host", host, "--port", String(port)],
  {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "production" },
  },
);

preview.stdout.on("data", (chunk) => process.stdout.write(`[preview] ${chunk}`));
preview.stderr.on("data", (chunk) => process.stderr.write(`[preview] ${chunk}`));

try {
  await waitForServer();

  for (const check of checks) {
    await verifyPage(check);
  }

  console.log("Rendered SEO head verification passed.");
} finally {
  preview.kill("SIGTERM");
}
