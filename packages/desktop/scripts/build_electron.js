#!/usr/bin/env node

const { build, context } = require("esbuild");
const path = require("path");

// Build script using esbuild like https://esbuild.github.io/getting-started/#build-scripts

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
})
  .then((buildResultOrContext) => watch && buildResultOrContext.watch())
  .catch(() => process.exit(1));
