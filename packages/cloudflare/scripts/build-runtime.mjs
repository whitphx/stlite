// Assemble the prebuilt runtime artifacts a published @stlite/cloudflare ships
// so it can build without the Stlite monorepo:
//   runtime/frontend                    the built Cloudflare-variant frontend
//   runtime/wheels/*.whl                the stlite_lib + stlite-pinned Streamlit wheels
//   runtime/streamlit-dependencies.json a snapshot of the Streamlit fork's deps
// Pure assembly, run from the monorepo by `make cloudflare`: the inputs (the
// staged frontend, the wheels) are produced by its Make prerequisites.
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { exists, singleWheel } from "../src/helpers/fsx.ts";

const execFileAsync = promisify(execFile);

const packageDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const rootDir = path.resolve(packageDir, "../..");
const runtimeDir = path.join(packageDir, "runtime");

const frontendSrc = path.join(packageDir, ".frontend-build");
if (!(await exists(frontendSrc))) {
  throw new Error(
    `Missing the staged Cloudflare frontend at ${frontendSrc}; run \`make cloudflare\` (or \`make cloudflare-frontend\`).`,
  );
}

await fs.rm(runtimeDir, { recursive: true, force: true });
await fs.mkdir(runtimeDir, { recursive: true });

await fs.cp(frontendSrc, path.join(runtimeDir, "frontend"), {
  recursive: true,
});

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
