#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";
import { build, context } from "esbuild";

// Build script using esbuild like https://esbuild.github.io/getting-started/#build-scripts

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const watch = process.argv.includes("--watch");
const production = process.env.NODE_ENV === "production";

(watch ? context : build)({
  entryPoints: [
    path.resolve(__dirname, "../electron/main.ts"),
    path.resolve(__dirname, "../electron/preload.ts"),
    path.resolve(__dirname, "../electron/worker.ts"),
  ],
  bundle: true,
  minify: production,
  platform: "node",
  tsconfig: path.resolve(__dirname, "../electron/tsconfig.json"),
  outdir: path.resolve(__dirname, "../build/electron"),
  external: ["electron", "electron-reload"],
  define: {
    ...(process.env.NODE_ENV != null
      ? {
          "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        }
      : null),
  },
  logLevel: "info",
}).then((buildResultOrContext) => watch && buildResultOrContext.watch());
