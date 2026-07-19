// Produce the prebuilt runtime artifacts a published @stlite/cloudflare ships so
// it can build without the Stlite monorepo:
//   runtime/frontend                    the built Cloudflare-variant frontend
//   runtime/wheels/*.whl                the stlite_lib + stlite-pinned Streamlit wheels
//   runtime/streamlit-dependencies.json a snapshot of the Streamlit fork's deps
// Run from the monorepo at release/pack time. The frontend is built here; the
// wheels are taken from `make stlite-lib-wheel streamlit-wheel` output (run
// before this) rather than rebuilt.
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { singleWheel } from "../src/helpers/fsx.ts";
import { buildMonorepoFrontend } from "./build-frontend.mjs";

const execFileAsync = promisify(execFile);

const packageDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const rootDir = path.resolve(packageDir, "../..");
const runtimeDir = path.join(packageDir, "runtime");

const frontendCacheDir = path.join(packageDir, ".frontend-cache");
await fs.mkdir(frontendCacheDir, { recursive: true });
const frontendSrc = await buildMonorepoFrontend({
  packageDir,
  rootDir,
  cacheDir: frontendCacheDir,
});

await fs.rm(runtimeDir, { recursive: true, force: true });
await fs.mkdir(runtimeDir, { recursive: true });

await fs.cp(frontendSrc, path.join(runtimeDir, "frontend"), {
  recursive: true,
});
// The build stamp is an internal detail of the monorepo frontend cache.
await fs.rm(path.join(runtimeDir, "frontend", ".build-stamp"), { force: true });

const wheelsDir = path.join(runtimeDir, "wheels");
await fs.mkdir(wheelsDir, { recursive: true });
await copySingleWheel(
  path.join(rootDir, "packages/kernel/py/stlite-lib/dist"),
  /^stlite_lib-.*-py3-none-any\.whl$/,
  wheelsDir,
);
await copySingleWheel(
  path.join(rootDir, "streamlit/lib/dist"),
  /^streamlit-.*-py3-none-any\.whl$/,
  wheelsDir,
);

const { stdout } = await execFileAsync("python3", [
  "-c",
  [
    "import json, sys, tomllib",
    "from pathlib import Path",
    "data = tomllib.loads(Path(sys.argv[1]).read_text())",
    "print(json.dumps(data['project']['dependencies']))",
  ].join("\n"),
  path.join(rootDir, "streamlit/lib/pyproject.toml"),
]);
await fs.writeFile(
  path.join(runtimeDir, "streamlit-dependencies.json"),
  `${stdout.trim()}\n`,
);

console.log(
  "Produced runtime/ (frontend + wheels + streamlit-dependencies.json)",
);

async function copySingleWheel(srcDir, pattern, destDir) {
  const wheelPath = await singleWheel(srcDir, pattern);
  await fs.copyFile(wheelPath, path.join(destDir, path.basename(wheelPath)));
}
