import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const trackedFiles = execFileSync("git", ["ls-files", "-z"]).toString().split("\0").filter(Boolean);
const sourceFiles = trackedFiles.filter((file) => /^src\/.*\.(?:[cm]?[jt]sx?)$/.test(file));

const allowedReads = new Map([
  ["process.env.RESEND_API_KEY", "src/lib/quote/email-service.ts"],
  ["import.meta.env.DEV", "src/router.tsx"],
]);
const findings = [];
const reads = [];

for (const file of sourceFiles) {
  const contents = readFileSync(file, "utf8");
  const patterns = [
    /\bprocess\.env\.([A-Z][A-Z0-9_]*)\b/g,
    /\bimport\.meta\.env\.([A-Z][A-Z0-9_]*)\b/g,
  ];

  for (const pattern of patterns) {
    for (const match of contents.matchAll(pattern)) {
      const read = match[0];
      reads.push([read, file]);
      if (allowedReads.get(read) !== file) {
        findings.push(`${file}: undocumented or misplaced environment read ${read}`);
      }
    }
  }
}

for (const [read, expectedFile] of allowedReads) {
  if (!reads.some(([foundRead, file]) => foundRead === read && file === expectedFile)) {
    findings.push(`${expectedFile}: expected environment read ${read} was not found`);
  }
}

const emailAdapter = readFileSync("src/lib/quote/email-service.ts", "utf8");
if (!/!key\s*\|\|\s*key\.trim\(\)\s*===\s*["']{2}/.test(emailAdapter)) {
  findings.push(
    "src/lib/quote/email-service.ts: RESEND_API_KEY must reject missing and blank values",
  );
}

const environmentDocs = readFileSync("docs/ENVIRONMENT.md", "utf8");
for (const [read] of reads) {
  if (!environmentDocs.includes(`\`${read}\``)) {
    findings.push(`docs/ENVIRONMENT.md: ${read} is read by source but is not documented`);
  }
}

for (const file of trackedFiles.filter((name) => /(?:^|\/)(?:\.env|wrangler\.jsonc)$/.test(name))) {
  const contents = readFileSync(file, "utf8");
  for (const match of contents.matchAll(/\b(VITE_[A-Z][A-Z0-9_]*)\b/g)) {
    const name = match[1];
    const explicitlyPublic = /(?:PUBLISHABLE|ANON)/.test(name);
    if (/(?:SECRET|PRIVATE|SERVICE_ROLE|PASSWORD|TOKEN|API_KEY)/.test(name) && !explicitlyPublic) {
      findings.push(
        `${file}: secret-like variable ${name} must not use the client-exposed VITE_ prefix`,
      );
    }
  }
}

const wrangler = readFileSync("wrangler.jsonc", "utf8");
if (!/"keep_vars"\s*:\s*true/.test(wrangler)) {
  findings.push("wrangler.jsonc: keep_vars must remain true to preserve dashboard-managed values");
}
if (/"RESEND_API_KEY"\s*:/.test(wrangler)) {
  findings.push("wrangler.jsonc: RESEND_API_KEY must remain an untracked Cloudflare Secret");
}

if (findings.length > 0) {
  console.error("Environment architecture validation failed (values suppressed):");
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exitCode = 1;
} else {
  console.log(
    `Environment validation passed: ${reads.length} approved source reads; secret values were not inspected or printed.`,
  );
}
