import { spawn } from "node:child_process";

const HOST = "127.0.0.1";
const PORT = 4173;
const PREVIEW_ORIGIN = `http://${HOST}:${PORT}`;
const CANONICAL_ORIGIN = "https://www.hestiva.co.za";

const cases = [
  { path: "/", expected: `${CANONICAL_ORIGIN}/` },
  {
    path: "/services/deep-cleaning",
    expected: `${CANONICAL_ORIGIN}/services/deep-cleaning`,
  },
  {
    path: "/locations/randburg",
    expected: `${CANONICAL_ORIGIN}/locations/randburg`,
  },
  {
    path: "/services/deep-cleaning?utm_source=runtime-check&utm_medium=ci",
    expected: `${CANONICAL_ORIGIN}/services/deep-cleaning`,
  },
];

function extractAttribute(tag, attribute) {
  const match = tag.match(
    new RegExp(`${attribute}\\s*=\\s*["']([^"']+)["']`, "i"),
  );
  return match?.[1] ?? null;
}

function canonicalValues(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)]
    .map(([tag]) => ({
      rel: extractAttribute(tag, "rel"),
      href: extractAttribute(tag, "href"),
    }))
    .filter(({ rel }) =>
      rel
        ?.split(/\s+/)
        .map((value) => value.toLowerCase())
        .includes("canonical"),
    )
    .map(({ href }) => href);
}

function openGraphUrlValues(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)]
    .map(([tag]) => ({
      property: extractAttribute(tag, "property"),
      content: extractAttribute(tag, "content"),
    }))
    .filter(({ property }) => property?.toLowerCase() === "og:url")
    .map(({ content }) => content);
}

async function waitForPreview() {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${PREVIEW_ORIGIN}/`);
      if (response.ok) return;
    } catch {
      // The preview server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error("Production preview did not become ready within 30 seconds.");
}

async function verifyCase(testCase) {
  const response = await fetch(`${PREVIEW_ORIGIN}${testCase.path}`, {
    redirect: "manual",
  });

  if (!response.ok) {
    throw new Error(`${testCase.path} returned HTTP ${response.status}.`);
  }

  const html = await response.text();
  const canonicals = canonicalValues(html);
  const openGraphUrls = openGraphUrlValues(html);

  if (canonicals.length !== 1) {
    throw new Error(
      `${testCase.path} rendered ${canonicals.length} canonical tags; expected exactly 1. Values: ${JSON.stringify(canonicals)}`,
    );
  }

  if (openGraphUrls.length !== 1) {
    throw new Error(
      `${testCase.path} rendered ${openGraphUrls.length} og:url tags; expected exactly 1. Values: ${JSON.stringify(openGraphUrls)}`,
    );
  }

  if (canonicals[0] !== testCase.expected) {
    throw new Error(
      `${testCase.path} canonical was ${JSON.stringify(canonicals[0])}; expected ${JSON.stringify(testCase.expected)}.`,
    );
  }

  if (openGraphUrls[0] !== testCase.expected) {
    throw new Error(
      `${testCase.path} og:url was ${JSON.stringify(openGraphUrls[0])}; expected ${JSON.stringify(testCase.expected)}.`,
    );
  }

  console.log(`✓ ${testCase.path} -> ${testCase.expected}`);
}

const preview = spawn(
  "bun",
  ["run", "preview", "--", "--host", HOST, "--port", String(PORT)],
  {
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, CI: "true" },
  },
);

preview.stdout.on("data", (chunk) => process.stdout.write(`[preview] ${chunk}`));
preview.stderr.on("data", (chunk) => process.stderr.write(`[preview] ${chunk}`));

try {
  await waitForPreview();

  for (const testCase of cases) {
    await verifyCase(testCase);
  }

  console.log("Rendered SEO head verification passed.");
} finally {
  preview.kill("SIGTERM");
}
