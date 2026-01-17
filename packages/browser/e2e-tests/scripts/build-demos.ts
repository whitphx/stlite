/**
 * Build script for E2E test demos.
 * Copies demo HTML files from ../../demos/ to ../pages-dist/
 * and replaces URL placeholders with localhost URLs for testing.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEMOS_DIR = path.resolve(__dirname, "../../demos");
const OUTPUT_DIR = path.resolve(__dirname, "../pages-dist");

const REPLACEMENTS: Record<string, string> = {
  "{{STLITE_JS_URL}}": "http://localhost:8081/stlite.js",
  "{{STLITE_CSS_URL}}": "http://localhost:8081/stlite.css",
};

function processFile(content: string): string {
  let result = content;
  for (const [placeholder, value] of Object.entries(REPLACEMENTS)) {
    result = result.replaceAll(placeholder, value);
  }
  return result;
}

function copyDir(src: string, dest: string): void {
  // Create destination directory
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      let content = fs.readFileSync(srcPath, "utf8");

      // Only process HTML files for placeholder replacement
      if (entry.name.endsWith(".html")) {
        content = processFile(content);
      }

      fs.writeFileSync(destPath, content);
      console.log(
        `Copied: ${path.relative(DEMOS_DIR, srcPath)} -> ${path.relative(OUTPUT_DIR, destPath)}`,
      );
    }
  }
}

function main(): void {
  console.log("Building demos for E2E tests...");
  console.log(`Source: ${DEMOS_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log("");

  // Clean output directory
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true });
  }

  // Copy and process demos
  copyDir(DEMOS_DIR, OUTPUT_DIR);

  console.log("");
  console.log("Done!");
}

main();
