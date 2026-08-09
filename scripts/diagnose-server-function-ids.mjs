import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const clientRoot = ".output/public";
const serverRoot = ".output/server";
const textExtensions = new Set([".js", ".mjs", ".json", ".html"]);
const hexIdPattern = /\b[a-f0-9]{64}\b/gi;
const metadataHintPattern = /serverFn|server.function|functionId|functionName|_serverFn/i;

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

function collectHexIds(entries) {
  const ids = new Map();

  for (const { file, text } of entries) {
    for (const match of text.matchAll(hexIdPattern)) {
      const id = match[0].toLowerCase();
      const locations = ids.get(id) ?? new Set();
      locations.add(path.relative(".", file));
      ids.set(id, locations);
    }
  }

  return ids;
}

const clientFiles = await readTextFiles(await collectTextFiles(clientRoot));
const serverFiles = await readTextFiles(await collectTextFiles(serverRoot));

const manifestEntries = serverFiles.filter(({ file }) => file.includes("tanstack-start-manifest"));
const contactEntries = serverFiles.filter(({ file }) => file.includes("contact.functions"));

if (manifestEntries.length === 0) {
  throw new Error("No generated TanStack Start server manifest was found in .output/server.");
}

if (contactEntries.length === 0) {
  throw new Error("No generated contact.functions server chunk was found in .output/server.");
}

const clientIds = collectHexIds(clientFiles);
const serverIds = collectHexIds(serverFiles);
const manifestIds = collectHexIds(manifestEntries);
const sharedIds = [...clientIds.keys()].filter((id) => serverIds.has(id)).sort();

console.log(`TanStack manifest: ${manifestEntries.map(({ file }) => path.relative(".", file)).join(", ")}`);
console.log(`Contact server chunk: ${contactEntries.map(({ file }) => path.relative(".", file)).join(", ")}`);
console.log(`64-hex tokens: client=${clientIds.size}, server=${serverIds.size}, manifest=${manifestIds.size}, shared=${sharedIds.length}`);

if (manifestIds.size > 0) {
  for (const [id, serverLocations] of [...manifestIds.entries()].sort()) {
    const clientLocations = clientIds.get(id);
    console.log(`manifest id ${id}`);
    console.log(`  manifest/server: ${[...serverLocations].sort().join(", ")}`);
    console.log(`  client: ${clientLocations ? [...clientLocations].sort().join(", ") : "NONE"}`);
  }
} else {
  console.log("The generated TanStack manifest does not encode server-function identifiers as literal 64-hex tokens.");
}

if (sharedIds.length > 0) {
  console.log("Shared 64-hex tokens present in both client and server output:");
  for (const id of sharedIds) {
    console.log(`  ${id}`);
  }
} else {
  console.log("No literal 64-hex token is shared between client and server output; inspecting generated metadata hints instead.");
}

let hintCount = 0;
for (const { file, text } of [...manifestEntries, ...contactEntries]) {
  const lines = text.split("\n");
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!metadataHintPattern.test(line)) continue;

    hintCount += 1;
    const compact = line.trim().replace(/\s+/g, " ").slice(0, 700);
    console.log(`metadata hint ${path.relative(".", file)}:${index + 1}: ${compact}`);

    if (hintCount >= 25) break;
  }
  if (hintCount >= 25) break;
}

if (hintCount === 0) {
  console.log("No textual server-function metadata hints were found in the generated manifest/contact chunk.");
}

console.log("Generated TanStack server-function metadata diagnostic completed.");
