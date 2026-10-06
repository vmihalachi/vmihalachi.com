// Verifies that the CSP in staticwebapp.config.json allows the inline <head> script of every
// page by its SHA-256 hash. Pass --fix to write the correct hash into the config.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const pages = ["index.html", "it/index.html", "ro/index.html"];
const configPath = new URL("../public/staticwebapp.config.json", import.meta.url);
const config = readFileSync(configPath, "utf8");

const hashes = new Set();
for (const page of pages) {
  const html = readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
  const inlineScript = html.match(/<script>(.*?)<\/script>/s)?.[1];
  if (inlineScript === undefined) {
    console.error(`No inline <script> found in ${page}.`);
    process.exit(1);
  }
  hashes.add(`'sha256-${createHash("sha256").update(inlineScript).digest("base64")}'`);
}

// The CSP holds a single hash, so the inline script must be byte-identical on every page.
if (hashes.size > 1) {
  console.error(`The inline <head> script differs between pages: ${pages.join(", ")}.`);
  console.error("Keep it identical, including whitespace.");
  process.exit(1);
}

const [expected] = hashes;
if (config.includes(expected)) process.exit(0);

if (process.argv.includes("--fix")) {
  writeFileSync(configPath, config.replace(/'sha256-[A-Za-z0-9+/=]+'/, expected));
  console.log(`Updated the CSP script hash to ${expected}.`);
} else {
  console.error(`The CSP script hash is out of date. Expected ${expected}.`);
  console.error("Run `npm run csp:fix` to update public/staticwebapp.config.json.");
  process.exit(1);
}
