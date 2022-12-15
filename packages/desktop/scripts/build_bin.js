#!/usr/bin/env node

// Build script using esbuild like https://esbuild.github.io/getting-started/#build-scripts

require("esbuild")
  .build({
    entryPoints: ["./bin/dump_artifacts.ts"],
    bundle: true,
    minify: true,
    platform: "node",
    external: [
      "@stlite/kernel", // Don't touch `require.resolve("@stlite/kernel") at the bundle time.
      "pyodide", // The `pyodide` package must be installed at runtime for the included Wasm files, so there is no reason to bundle it here.
      "node-fetch", // `node-fetch` will be installed at runtime anyway because it is one dependency of the `pyodide` package, so there is no reason to bundle it here.
      "fs-extra", // `fs-extra` and `yargs` will be installed at runtime anyway as the dependencies of `electron-builder`, so we don't have to bundle them here.
      "yargs", // Same as above, `fs-extra`.
    ],
    outfile: "./bin/dump_artifacts.js",
    logLevel: "info",
  })
  .catch(() => process.exit(1));
