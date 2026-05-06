#!/usr/bin/env node

// Build the cli's esbuild bundle. Run via `yarn build` (see package.json).
//
// We hand-write this script (rather than a one-liner `esbuild ...` in
// package.json) so we can read `@stlite/browser`'s package.json at build
// time and bake its version into the bundle as the default
// `--runtime-version` for `stlite html`. Pinning to whichever browser
// version is bundled with this cli release keeps the auto-pin in lockstep
// with the workspace, avoiding the drift that hardcoding produced.

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cliDir = path.resolve(__dirname, "..");

const browserPkg = JSON.parse(
  fs.readFileSync(path.resolve(cliDir, "../browser/package.json"), "utf8"),
);

await build({
  entryPoints: [path.resolve(cliDir, "src/cli.ts")],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: path.resolve(cliDir, "dist/cli.js"),
  banner: {
    js: "#!/usr/bin/env node",
  },
  define: {
    __STLITE_BROWSER_VERSION__: JSON.stringify(browserPkg.version),
  },
  external: ["pyodide", "fs-extra", "@stlite/browser", "@stlite/desktop"],
  logLevel: "info",
});
