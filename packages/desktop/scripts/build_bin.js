#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";
import { getStreamlitWheelFileName } from "@stlite/tooling";

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
      "yargs", // Installed at runtime as a dependency of electron-builder; no need to bundle.
      "fs-extra", // Declared in @stlite/desktop's runtime dependencies.
      "pyodide", // Has WASM/binary assets esbuild can't bundle; declared in @stlite/desktop's runtime dependencies.
      // NOTE: @stlite/app-packager (and its transitive @stlite/common) are
      // private workspace packages that aren't published to npm — bundle them
      // inline so @stlite/desktop's published tarball stays self-contained.
      // glob is bundled too (transitively pulled in by @stlite/app-packager).
    ],
    define: {
      "process.env.PATH_FROM_SCRIPT_TO_BUILD": JSON.stringify("../build"),
      "process.env.PATH_FROM_SCRIPT_TO_WHEELS": JSON.stringify("../wheels"),
      "process.env.STREAMLIT_WHEEL_FILE_NAME": JSON.stringify(
        getStreamlitWheelFileName(),
      ),
      "process.env.STLITE_LIB_WHEEL_FILE_NAME": JSON.stringify(
        "stlite_lib-0.1.0-py3-none-any.whl",
      ),
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
