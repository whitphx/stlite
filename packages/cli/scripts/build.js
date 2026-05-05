#!/usr/bin/env node

// Build the cli's esbuild bundle. Run via `yarn build` (see package.json).

import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliDir = path.resolve(__dirname, "..");

await build({
  entryPoints: [path.resolve(cliDir, "src/cli.ts")],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: path.resolve(cliDir, "dist/cli.js"),
  banner: {
    js:
      "#!/usr/bin/env node\n" +
      // ESM bundles can't `require()` directly; restore it for any externals
      // (pyodide, fs-extra, @stlite/desktop's manifest module) that use CJS.
      'import { createRequire as __cliCreateRequire } from "node:module"; ' +
      "const require = __cliCreateRequire(import.meta.url);",
  },
  // Bundle @stlite/app-packager (and its transitive private deps, common +
  // sharing-common) inline so consumers of @stlite/cli on npm don't need
  // those private packages — same approach as packages/desktop's bin.
  external: ["pyodide", "fs-extra", "@stlite/browser", "@stlite/desktop"],
  logLevel: "info",
});
