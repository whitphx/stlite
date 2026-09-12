#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { build } from "../dist/index.js";

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
      "asset-runtime": { type: "boolean", default: false },
      "plain-worker": { type: "boolean", default: false },
      slim: { type: "boolean", default: false },
      mock: { type: "string", multiple: true, default: [] },
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
  const {
    "asset-runtime": assetRuntime,
    "plain-worker": plainWorker,
    ...rest
  } = values;
  return {
    path: positionals[0],
    ...rest,
    bundledRuntime: !assetRuntime,
    plainWorker,
  };
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
  --name <name>              Worker name for a generated wrangler.jsonc (default: derived from <path>)
  --asset-runtime            Ship the Python runtime as static assets the Worker
                             installs at cold start, instead of bundling it into
                             the script. Trades an asset fetch and extraction at
                             cold start for a smaller isolate footprint: the
                             libraries stay compressed and are read by zipimport
  --plain-worker             Run as a plain Worker instead of the default single
                             Durable Object instance. Limited: only media is bridged
                             across isolates — file uploads may fail and reconnects
                             reset session state — but memory load spreads out,
                             suiting read-only, memory-heavy apps
  --mock <package>           Replace a package with an import stub and drop what
                             it alone pulled into the runtime (repeatable)
  --slim                     Alias for --mock pandas --mock numpy: the tested
                             combination for apps without dataframes/charts,
                             roughly halving the script size and boot time

Deploy the output with Wrangler:
  cd <out> && npx wrangler deploy
`);
}
