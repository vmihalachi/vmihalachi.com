// Verifies that the CSP in staticwebapp.config.json allows the inline <head> script in
// index.html by its SHA-256 hash. Pass --fix to write the correct hash into the config.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const configPath = new URL("../public/staticwebapp.config.json", import.meta.url);
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const config = readFileSync(configPath, "utf8");

const inlineScript = html.match(/<script>(.*?)<\/script>/s)?.[1];
if (inlineScript === undefined) {
  console.error("No inline <script> found in index.html.");
  process.exit(1);
}

const expected = `'sha256-${createHash("sha256").update(inlineScript).digest("base64")}'`;
if (config.includes(expected)) process.exit(0);

if (process.argv.includes("--fix")) {
  writeFileSync(configPath, config.replace(/'sha256-[A-Za-z0-9+/=]+'/, expected));
  console.log(`Updated the CSP script hash to ${expected}.`);
} else {
  console.error(`The CSP script hash is out of date. Expected ${expected}.`);
  console.error("Run `npm run csp:fix` to update public/staticwebapp.config.json.");
  process.exit(1);
}
