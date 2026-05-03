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

const commonOptions = {
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
};

// Electron's main/preload/worker run inside Electron's own runtime, which
// expects CJS output regardless of the package's "type": "module".
const electronBuildOptions = {
  ...commonOptions,
  entryPoints: [
    path.resolve(__dirname, "../electron/main.ts"),
    path.resolve(__dirname, "../electron/preload.ts"),
    path.resolve(__dirname, "../electron/worker.ts"),
  ],
  format: "cjs",
};

// manifest.ts is a build-time helper that @stlite/cli imports from Node, so
// it must be ESM to match @stlite/desktop's package.json `"type": "module"`.
const manifestBuildOptions = {
  ...commonOptions,
  entryPoints: [path.resolve(__dirname, "../electron/manifest.ts")],
  format: "esm",
};

(watch ? context : build)(electronBuildOptions).then(
  (buildResultOrContext) => watch && buildResultOrContext.watch(),
);
(watch ? context : build)(manifestBuildOptions).then(
  (buildResultOrContext) => watch && buildResultOrContext.watch(),
);
