import * as fs from "node:fs";
import * as path from "node:path";

const IGNORED_DIRS = new Set([".git", "__pycache__", ".venv", "node_modules"]);
const isIgnoredFile = (name: string) => name.endsWith(".pyc");

/**
 * Walks `projectDir` and returns POSIX-style relative paths of every file,
 * skipping a small set of well-known noise directories (`.git`,
 * `__pycache__`, `.venv`, `node_modules`) and `.pyc` byte-code. Used by every
 * command in this package as the canonical "what files are in this project"
 * answer.
 */
export function collectProjectFiles(projectDir: string): string[] {
  const out: string[] = [];
  walk(projectDir, [], out);
  return out;
}

function walk(rootDir: string, relParts: string[], out: string[]): void {
  const dirAbs = path.join(rootDir, ...relParts);
  for (const entry of fs.readdirSync(dirAbs, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      walk(rootDir, [...relParts, entry.name], out);
    } else if (entry.isFile()) {
      if (isIgnoredFile(entry.name)) continue;
      out.push([...relParts, entry.name].join("/"));
    }
  }
}
