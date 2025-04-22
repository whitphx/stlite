#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Build script using esbuild like https://esbuild.github.io/getting-started/#build-scripts

const infile = path.resolve(__dirname, "../bin-src/dump_artifacts/index.ts");
const outfile = path.resolve(__dirname, "../bin/dump_artifacts.js");

esbuild
  .build({
    entryPoints: [infile],
    bundle: true,
    minify: true,
    platform: "node",
    format: "esm",
    external: [
      "pyodide", // The `pyodide` package must be installed at runtime for the included Wasm files, so there is no reason to bundle it here.
      "fs-extra", // `fs-extra` and `yargs` will be installed at runtime anyway as the dependencies of `electron-builder`, so we don't have to bundle them here.
      "yargs", // Same as above, `fs-extra`.
    ],
    define: {
      "process.env.PATH_FROM_SCRIPT_TO_BUILD": JSON.stringify("../build"),
      "process.env.PATH_FROM_SCRIPT_TO_WHEELS": JSON.stringify("../wheels"),
    },
    outfile,
    logLevel: "info",
    banner: {
      // Fix the 'Dynamic require of "xxx" is not supported' error when bundled as an ESM module.
      // Ref: https://github.com/evanw/esbuild/issues/1921#issuecomment-2302290651
      js: `
import { createRequire } from "module";
const require = createRequire(import.meta.url);
`,
    },
  })
  .then(() => {
    // Replace the shebang line in the output file
    const data = fs.readFileSync(outfile, "utf-8");

    const matcher = /^#!.*$/my;
    matcher.lastIndex = 0;
    const result = data.replace(matcher, "#!/usr/bin/env node");

    fs.writeFileSync(outfile, result);
  });
