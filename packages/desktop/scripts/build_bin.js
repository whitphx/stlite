#!/usr/bin/env node

const path = require("path");
const fs = require("fs");

// Build script using esbuild like https://esbuild.github.io/getting-started/#build-scripts

const inputFile = path.resolve(__dirname, "../bin-src/dump_artifacts.ts");
const outputFile = path.resolve(__dirname, "../bin/dump_artifacts.js");

require("esbuild")
  .build({
    entryPoints: [inputFile],
    bundle: true,
    minify: true,
    platform: "node",
    external: [
      "pyodide", // The `pyodide` package must be installed at runtime for the included Wasm files, so there is no reason to bundle it here.
      "node-fetch", // `node-fetch` will be installed at runtime anyway because it is one dependency of the `pyodide` package, so there is no reason to bundle it here.
      "fs-extra", // `fs-extra` and `yargs` will be installed at runtime anyway as the dependencies of `electron-builder`, so we don't have to bundle them here.
      "yargs", // Same as above, `fs-extra`.
    ],
    outfile: outputFile,
    logLevel: "info",
  })
  .then(() => {
    // Replace the shebang line in the output file
    const data = fs.readFileSync(outputFile, "utf-8");

    const matcher = /^#!.*$/my;
    matcher.lastIndex = 0;
    const result = data.replace(matcher, "#!/usr/bin/env node");

    fs.writeFileSync(outputFile, result);
  })
  .catch(() => process.exit(1));
