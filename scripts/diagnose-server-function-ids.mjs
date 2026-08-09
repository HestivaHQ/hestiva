import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const clientRoot = ".output/public";
const serverRoot = ".output/server";
const textExtensions = new Set([".js", ".mjs", ".json", ".html"]);
const serverFunctionPattern = /\/_serverFn\/([a-f0-9]{64})\b/gi;

async function collectTextFiles(root) {
  const files = [];

  async function walk(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
      } else if (textExtensions.has(path.extname(entry.name))) {
        files.push(absolute);
      }
    }
  }

  await walk(root);
  return files;
}

async function readTextFiles(files) {
  return Promise.all(
    files.map(async (file) => ({
      file,
      text: await readFile(file, "utf8"),
    })),
  );
}

const clientFiles = await readTextFiles(await collectTextFiles(clientRoot));
const serverFiles = await readTextFiles(await collectTextFiles(serverRoot));
const clientIds = new Map();

for (const { file, text } of clientFiles) {
  for (const match of text.matchAll(serverFunctionPattern)) {
    const id = match[1].toLowerCase();
    const files = clientIds.get(id) ?? new Set();
    files.add(path.relative(".", file));
    clientIds.set(id, files);
  }
}

if (clientIds.size === 0) {
  throw new Error("No client /_serverFn/<64-hex-id> references were found in .output/public.");
}

let failed = false;
console.log(`Found ${clientIds.size} unique client server-function ID(s).`);

for (const [id, clientLocations] of [...clientIds.entries()].sort()) {
  const allServerMatches = serverFiles
    .filter(({ text }) => text.includes(id))
    .map(({ file }) => path.relative(".", file));
  const registrationMatches = allServerMatches.filter(
    (file) =>
      file.includes("tanstack-start-manifest") ||
      file.includes("contact.functions") ||
      file === ".output/server/index.mjs",
  );

  console.log(`serverFn ${id}`);
  console.log(`  client: ${[...clientLocations].sort().join(", ")}`);
  console.log(
    `  server registration candidates: ${registrationMatches.length ? registrationMatches.join(", ") : "NONE"}`,
  );
  console.log(`  all server matches: ${allServerMatches.length}`);

  if (registrationMatches.length === 0) {
    failed = true;
  }
}

const manifestFiles = serverFiles
  .map(({ file }) => path.relative(".", file))
  .filter((file) => file.includes("tanstack-start-manifest"));

console.log(`TanStack manifest files: ${manifestFiles.length ? manifestFiles.join(", ") : "NONE"}`);

if (manifestFiles.length === 0) {
  failed = true;
}

if (failed) {
  throw new Error(
    "Client/server server-function ID diagnostic failed: at least one client ID has no registration-candidate match, or no TanStack server manifest was generated.",
  );
}

console.log("Client/server server-function ID diagnostic passed.");
