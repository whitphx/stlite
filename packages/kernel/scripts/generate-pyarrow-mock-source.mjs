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
// by \`make pyarrow-mock-source\` (scripts/generate-pyarrow-mock-source.mjs). Do not edit.
export const PYARROW_MOCK_SOURCE = ${JSON.stringify(source)};
`;

fs.writeFileSync(outPath, content);
console.log(`Wrote ${path.relative(process.cwd(), outPath)}`);
