// Produce the prebuilt runtime artifacts a published @stlite/cloudflare ships so
// it can build without the Stlite monorepo: runtime/frontend (the built
// Cloudflare-variant Streamlit frontend) and runtime/streamlit-dependencies.json
// (a snapshot of the Streamlit fork's declared dependencies, which the vendoring
// step needs). Run from the monorepo at release/pack time. The built frontend is
// taken from STLITE_CLOUDFLARE_FRONTEND_SRC (produced earlier in the build)
// rather than rebuilt here, to avoid a second multi-minute frontend build.
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const packageDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const rootDir = path.resolve(packageDir, "../..");
const runtimeDir = path.join(packageDir, "runtime");

const frontendSrc = process.env.STLITE_CLOUDFLARE_FRONTEND_SRC;
if (!frontendSrc) {
  throw new Error(
    "STLITE_CLOUDFLARE_FRONTEND_SRC must point at the built Cloudflare frontend directory",
  );
}

await fs.rm(runtimeDir, { recursive: true, force: true });
await fs.mkdir(runtimeDir, { recursive: true });

await fs.cp(frontendSrc, path.join(runtimeDir, "frontend"), {
  recursive: true,
});
// The build stamp is an internal detail of the monorepo frontend cache.
await fs.rm(path.join(runtimeDir, "frontend", ".build-stamp"), { force: true });

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

console.log("Produced runtime/ (frontend + streamlit-dependencies.json)");
