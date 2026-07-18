// Emit the pyarrow shim source (the single source of truth in stlite_lib) as a
// TS constant so worker-runtime.ts can register it with micropip *before*
// installing packages — blocking the real (Pyodide-incompatible) pyarrow wheel
// and providing the stub in one step, without waiting for stlite_lib to install.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const shimPath = path.resolve(
  scriptDir,
  "../py/stlite-lib/stlite_lib/_pyarrow_shim.py",
);
const outPath = path.resolve(scriptDir, "../src/pyarrow-mock-source.ts");

const source = fs.readFileSync(shimPath, "utf8");

const content = `// AUTO-GENERATED from packages/kernel/py/stlite-lib/stlite_lib/_pyarrow_shim.py
// by scripts/generate-pyarrow-mock-source.mjs (run from kernel's build/test
// scripts). Do not edit; it is gitignored.
export const PYARROW_MOCK_SOURCE = ${JSON.stringify(source)};
`;

// Idempotent: kernel's build/test scripts run this on every invocation, so avoid
// rewriting (and churning the mtime, which would force a tsc recompile) when the
// content is unchanged.
if (readOrNull(outPath) !== content) {
  fs.writeFileSync(outPath, content);
  console.log(`Wrote ${path.relative(process.cwd(), outPath)}`);
}

function readOrNull(p) {
  try {
    return fs.readFileSync(p, "utf8");
  } catch {
    return null;
  }
}
