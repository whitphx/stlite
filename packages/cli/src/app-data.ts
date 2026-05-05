import * as fs from "node:fs";
import * as path from "node:path";
import type { AppData, File } from "@stlite/sharing-common";
import { collectProjectFiles } from "./project-files.js";

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

export interface BuildAppDataOptions {
  projectDir: string;
  entrypoint: string;
  /** Explicit path to a requirements.txt; falls back to <projectDir>/requirements.txt if present. */
  requirementsPath?: string;
}

export function buildAppData(opts: BuildAppDataOptions): AppData {
  let projectStat;
  try {
    projectStat = fs.statSync(opts.projectDir);
  } catch {
    throw new Error(`Not a directory: ${opts.projectDir}`);
  }
  if (!projectStat.isDirectory()) {
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
  // Sort lexicographically so the proto map is built in deterministic order;
  // both ts-proto and betterproto serialize map entries in iteration order, so
  // matching the order across runtimes is what gives us byte-identical output.
  // Note: Array.prototype.sort() compares UTF-16 code units, while Python's
  // sorted() compares Unicode code points. The two agree for the BMP but can
  // disagree for astral-plane characters (e.g. emoji) in filenames — a real
  // but rare edge case. Mirror any change here in the Python collect_files().
  const relPaths = collectProjectFiles(rootDir).sort();

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

function readRequirements(reqPath: string): string[] {
  return fs
    .readFileSync(reqPath, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}
