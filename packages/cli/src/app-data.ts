import * as fs from "node:fs";
import * as path from "node:path";
import type { AppData, File } from "@stlite/sharing-common";

const TEXT_EXTS = new Set([
  ".py",
  ".txt",
  ".csv",
  ".md",
  ".json",
  ".yml",
  ".yaml",
  ".toml",
]);

const IGNORED_DIRS = new Set([".git", "__pycache__", ".venv", "node_modules"]);
const isIgnoredFile = (name: string) => name.endsWith(".pyc");

export interface BuildAppDataOptions {
  projectDir: string;
  entrypoint: string;
  /** Explicit path to a requirements.txt; falls back to <projectDir>/requirements.txt if present. */
  requirementsPath?: string;
}

export function buildAppData(opts: BuildAppDataOptions): AppData {
  if (!fs.statSync(opts.projectDir).isDirectory()) {
    throw new Error(`Not a directory: ${opts.projectDir}`);
  }
  const entrypointAbs = path.join(opts.projectDir, opts.entrypoint);
  if (!fs.existsSync(entrypointAbs)) {
    throw new Error(
      `Entrypoint not found: ${opts.entrypoint} (looked in ${opts.projectDir})`,
    );
  }

  const files = collectFiles(opts.projectDir);

  const requirementsPath =
    opts.requirementsPath ??
    (() => {
      const defaultPath = path.join(opts.projectDir, "requirements.txt");
      return fs.existsSync(defaultPath) ? defaultPath : null;
    })();
  const requirements = requirementsPath
    ? readRequirements(requirementsPath)
    : [];

  return {
    entrypoint: opts.entrypoint,
    files,
    requirements,
  };
}

function collectFiles(rootDir: string): { [path: string]: File } {
  const relPaths: string[] = [];
  walk(rootDir, [], relPaths);
  // Sort lexicographically so the proto map is built in deterministic order;
  // both ts-proto and betterproto serialize map entries in iteration order, so
  // matching the order across runtimes is what gives us byte-identical output.
  relPaths.sort();

  const result: { [path: string]: File } = {};
  for (const rel of relPaths) {
    const abs = path.join(rootDir, rel);
    const ext = path.extname(rel).toLowerCase();
    if (TEXT_EXTS.has(ext)) {
      result[rel] = {
        content: { $case: "text", text: fs.readFileSync(abs, "utf8") },
      };
    } else {
      result[rel] = {
        content: {
          $case: "data",
          data: new Uint8Array(fs.readFileSync(abs)),
        },
      };
    }
  }
  return result;
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

function readRequirements(reqPath: string): string[] {
  return fs
    .readFileSync(reqPath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}
