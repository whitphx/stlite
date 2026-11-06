// Moves the declaration files `vite.types.config.ts` wrote to build-types/
// into build/, next to the bundle `vite.js.config.ts` wrote there. They run in
// parallel, and the bundle's build empties build/ when it starts, so the
// declarations wait in a directory of their own until both are done.
import fs from "node:fs";
import path from "node:path";

const from = path.resolve(import.meta.dirname, "../build-types");
const to = path.resolve(import.meta.dirname, "../build");

const declarations = fs
  .readdirSync(from)
  .filter((name) => name.endsWith(".d.ts"));
if (declarations.length === 0) {
  throw new Error(`No declaration files in ${from}`);
}
for (const name of declarations) {
  fs.copyFileSync(path.join(from, name), path.join(to, name));
}
fs.rmSync(from, { recursive: true });
