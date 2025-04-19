#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { parse } from "node-html-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indexHtmlPath = path.resolve(__dirname, "../build/index.html");

const indexHtml = fs.readFileSync(indexHtmlPath, { encoding: "utf8" });

const root = parse(indexHtml);

if (
  !root
    .querySelector('html > head > meta[http-equiv="Content-Security-Policy"]')
    ?.getAttribute("content")
) {
  throw new Error("Content-Security-Policy meta tag is missing in index.html");
}

console.log("[OK] Content-Security-Policy meta tag is present in index.html");
