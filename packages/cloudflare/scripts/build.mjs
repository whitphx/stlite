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
  entryPoints: [path.join(packageDir, "src/vendor-prebuilt.mjs")],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: path.join(packageDir, "dist/vendor-prebuilt.js"),
  // pyodide carries wasm and dynamic requires; keep it (and the archive libs,
  // which are declared runtime dependencies) external instead of inlining.
  external: ["pyodide", "tar", "fflate"],
  logLevel: "info",
});
