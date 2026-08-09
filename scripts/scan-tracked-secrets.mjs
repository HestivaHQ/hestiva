import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const trackedFiles = execFileSync("git", ["ls-files", "-z"])
  .toString()
  .split("\0")
  .filter(Boolean);

const publicConfigurationNames = new Set([
  "SUPABASE_ANON_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "VITE_SUPABASE_ANON_KEY",
  "VITE_SUPABASE_PUBLISHABLE_KEY",
]);

const credentialAssignment =
  /^\s*["']?([A-Z][A-Z0-9_]*(?:API_KEY|API_TOKEN|ACCESS_TOKEN|AUTH_TOKEN|SECRET|SECRET_KEY|SERVICE_ROLE_KEY|PRIVATE_KEY|PASSWORD))["']?\s*[=:]\s*["']?([^\s,"']{8,})/;

const tokenSignatures = [
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ["AWS access key", /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/],
  ["GitHub token", /\b(?:gh[pousr]_[A-Za-z0-9]{36,255}|github_pat_[A-Za-z0-9_]{80,255})\b/],
  ["Stripe secret key", /\bsk_(?:live|test)_[A-Za-z0-9]{16,}\b/],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/],
];

const findings = [];

for (const file of trackedFiles) {
  const contents = readFileSync(file);
  if (contents.includes(0)) continue;

  for (const [index, line] of contents.toString("utf8").split(/\r?\n/).entries()) {
    const assignment = line.match(credentialAssignment);
    if (assignment && !publicConfigurationNames.has(assignment[1])) {
      const value = assignment[2];
      const isPlaceholder =
        /^(?:example|placeholder|changeme|redacted|your[_-]|<)/i.test(value) ||
        value.includes("${{") ||
        value.includes("process.env");
      if (!isPlaceholder) findings.push([file, index + 1, `credential assigned to ${assignment[1]}`]);
    }

    for (const [description, pattern] of tokenSignatures) {
      if (pattern.test(line)) findings.push([file, index + 1, description]);
    }
  }
}

if (findings.length > 0) {
  console.error("Potential private credentials found in tracked files (values suppressed):");
  for (const [file, line, description] of findings) {
    console.error(`${file}:${line}: ${description}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Secret scan passed for ${trackedFiles.length} tracked files.`);
}
