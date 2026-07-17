#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { build } from "../src/build.mjs";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const packageJson = JSON.parse(
  await fs.readFile(path.join(packageRoot, "package.json"), "utf8"),
);

const [command = "help", ...args] = process.argv.slice(2);

try {
  switch (command) {
    case "build":
      await build(parseBuildArgs(args));
      break;
    case "help":
    case "--help":
    case "-h":
      printHelp();
      break;
    default:
      throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}

function parseBuildArgs(args) {
  const { values, positionals } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      out: { type: "string", short: "o", default: "./dist" },
      entrypoint: { type: "string", default: "streamlit_app.py" },
      requirements: { type: "string" },
      name: { type: "string" },
    },
  });
  if (positionals.length === 0) {
    throw new Error("Missing <path> to the Streamlit project directory");
  }
  if (positionals.length > 1) {
    throw new Error(
      `Unexpected extra arguments: ${positionals.slice(1).join(" ")}`,
    );
  }
  return { path: positionals[0], ...values };
}

function printHelp() {
  console.log(`stlite-cloudflare ${packageJson.version}

Package a Streamlit project into a deployable Cloudflare Python Workers directory.

Usage:
  stlite-cloudflare build <path> [options]

Options:
  -o, --out <dir>            Output directory (default: ./dist)
  --entrypoint <name>        Entrypoint script, relative to <path> (default: streamlit_app.py)
  --requirements <file>      requirements.txt (default: <path>/requirements.txt if present)
  --name <name>              Worker name for a generated wrangler.jsonc (default: derived from <out>)

Deploy the output with Wrangler:
  cd <out> && npx wrangler deploy
`);
}
