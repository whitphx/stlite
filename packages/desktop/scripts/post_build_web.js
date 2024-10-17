#!/usr/bin/env node

const path = require("node:path");
const fs = require("node:fs");
const { parse } = require("node-html-parser");

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
