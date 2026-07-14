// Bundle the vendoring script (and its @stlite/app-packager import) into a
// single self-contained module under dist/. The published package ships this
// bundle so `stlite-cloudflare build` runs without the monorepo's
// @stlite/app-packager source; the monorepo build keeps using the raw script
// under scripts/.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const packageDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

await build({
  entryPoints: [
    path.join(packageDir, "scripts/vendor-pyodide-prebuilt-packages.mjs"),
  ],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: path.join(packageDir, "dist/vendor-pyodide-prebuilt-packages.mjs"),
  // pyodide carries wasm and dynamic requires; keep it a runtime dependency
  // instead of inlining it (matches @stlite/cli's bundle).
  external: ["pyodide"],
  logLevel: "info",
});
