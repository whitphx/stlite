// Bundle the build orchestration (src/build.ts and everything it pulls in,
// including the @stlite/app-packager and @stlite/common workspace sources) into
// a self-contained dist/index.js, so the published package runs
// `stlite-cloudflare build` without the monorepo on disk. The bin and the
// programmatic `build` export both point at this bundle; declared runtime
// dependencies stay external and resolve from node_modules at runtime. The
// type declarations are emitted separately by `tsc -p tsconfig.build.json`
// (chained in package.json's build script).
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
  entryPoints: [path.join(packageDir, "src/build.ts")],
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  outfile: path.join(distDir, "index.js"),
  external: ["pyodide", "cross-spawn", "jsonc-parser", "ignore", "smol-toml"],
  logLevel: "info",
});
