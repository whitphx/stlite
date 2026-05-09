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
  walk(projectDir, [], out, new Set([fs.realpathSync(projectDir)]));
  return out;
}

function walk(
  rootDir: string,
  relParts: string[],
  out: string[],
  visitedDirs: Set<string>,
): void {
  const dirAbs = path.join(rootDir, ...relParts);
  for (const entry of fs.readdirSync(dirAbs, { withFileTypes: true })) {
    // For symlinks, follow to determine whether the target is a file or dir.
    // (Dirent.isFile() and isDirectory() return false for the link itself.)
    let kind: "dir" | "file" | "skip" = "skip";
    if (entry.isDirectory()) {
      kind = "dir";
    } else if (entry.isFile()) {
      kind = "file";
    } else if (entry.isSymbolicLink()) {
      try {
        const target = fs.statSync(path.join(dirAbs, entry.name));
        if (target.isDirectory()) kind = "dir";
        else if (target.isFile()) kind = "file";
      } catch {
        // Broken symlink — skip silently.
      }
    }

    if (kind === "dir") {
      if (IGNORED_DIRS.has(entry.name)) continue;
      // Symlink loop guard: a symlink pointing back into an ancestor would
      // recurse forever. realpath collapses the link; if we've already
      // visited that target, skip.
      const childAbs = path.join(dirAbs, entry.name);
      let childReal: string;
      try {
        childReal = fs.realpathSync(childAbs);
      } catch {
        continue;
      }
      if (visitedDirs.has(childReal)) continue;
      visitedDirs.add(childReal);
      walk(rootDir, [...relParts, entry.name], out, visitedDirs);
    } else if (kind === "file") {
      if (isIgnoredFile(entry.name)) continue;
      out.push([...relParts, entry.name].join("/"));
    }
  }
}
