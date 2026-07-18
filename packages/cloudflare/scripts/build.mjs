// Bundle the build orchestration into a single self-contained dist/index.js so
// the published package runs `stlite-cloudflare build` without the workspace
// sources it pulls in (@stlite/app-packager for vendoring, @stlite/common for
// requirements parsing). The bin and the programmatic `build` export both point
// at this bundle; declared runtime dependencies stay external and resolve from
// node_modules at runtime.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

const packageDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

// esbuild only writes its own output; wipe dist/ first so renamed/removed
// bundles don't linger and get shipped (files ships the whole dist/).
const distDir = path.join(packageDir, "dist");
await fs.rm(distDir, { recursive: true, force: true });

await build({
  entryPoints: [path.join(packageDir, "src/build.mjs")],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: path.join(packageDir, "dist/index.js"),
  external: ["pyodide", "tar", "fflate", "cross-spawn"],
  logLevel: "info",
});
