#!/usr/bin/env node

import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { build, context } from "esbuild";

// Build script using esbuild like https://esbuild.github.io/getting-started/#build-scripts

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const watch = process.argv.includes("--watch");
const production = process.env.NODE_ENV === "production";

// esbuild has no equivalent of Vite's `?raw` suffix, which kernel's
// worker-runtime uses to inline the pyarrow shim source. Resolve such imports
// to the underlying file and load it as text.
const rawSuffixPlugin = {
  name: "raw-suffix",
  setup(build) {
    build.onResolve({ filter: /\?raw$/ }, (args) => ({
      path: path.resolve(args.resolveDir, args.path.replace(/\?raw$/, "")),
      namespace: "raw-suffix",
    }));
    build.onLoad({ filter: /.*/, namespace: "raw-suffix" }, async (args) => ({
      contents: await fs.readFile(args.path, "utf8"),
      loader: "text",
      // A custom namespace isn't tracked as a filesystem dependency on its
      // own, so `--watch` would miss edits to the raw source without this.
      watchFiles: [args.path],
    }));
  },
};

const commonOptions = {
  bundle: true,
  minify: production,
  platform: "node",
  tsconfig: path.resolve(__dirname, "../electron/tsconfig.json"),
  outdir: path.resolve(__dirname, "../build/electron"),
  plugins: [rawSuffixPlugin],
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

Promise.all([
  (watch ? context : build)(electronBuildOptions),
  (watch ? context : build)(manifestBuildOptions),
])
  .then((buildResultOrContexts) => {
    if (watch) {
      buildResultOrContexts.forEach((rc) => rc.watch());
    }
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
