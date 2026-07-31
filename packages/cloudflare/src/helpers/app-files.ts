import fs from "node:fs/promises";
import path from "node:path";
import ignore from "ignore";

/**
 * Exclusions that always apply when packaging the user's project into the
 * Worker: version control, secrets, environments, tool caches, and local
 * build state have no place in a deployed app package regardless of what the
 * project's own ignore file says. Kept to names/dirs (no broad content-type
 * extensions) so legitimate application data is never dropped by accident.
 */
const MANDATORY_EXCLUSIONS = [
  ".git/",
  ".env",
  ".env.*",
  "*.env",
  ".venv/",
  "venv/",
  ".direnv/",
  "node_modules/",
  "__pycache__/",
  ".pytest_cache/",
  ".mypy_cache/",
  ".ruff_cache/",
  ".wrangler/",
  ".venv-workers/",
  ".DS_Store",
  // Build inputs consumed by the scaffold, not app data.
  ".stliteignore",
  "wrangler.jsonc",
];

const LARGE_FILE_THRESHOLD = 5 * 1024 * 1024;

export interface AppMirrorSummary {
  fileCount: number;
  totalBytes: number;
  /** Included files at or above LARGE_FILE_THRESHOLD, largest first. */
  largeFiles: { relPath: string; bytes: number }[];
  excludedCount: number;
}

/**
 * Mirror the user's project directory into the vendored app package,
 * applying the mandatory exclusions plus the project's optional
 * `.stliteignore` (gitignore syntax). `excludeDirs` removes specific
 * absolute paths (the output and cache directories) wherever they are.
 */
export async function mirrorAppDir(
  appDir: string,
  destDir: string,
  excludeDirs: string[] = [],
): Promise<AppMirrorSummary> {
  // Two independent matchers: a path is copied only when NEITHER excludes
  // it. Feeding both rule sets into one matcher would let a later
  // .stliteignore negation (e.g. `!.env`) re-include files the mandatory
  // list guarantees are never packaged; kept separate, user negations only
  // act within the user's own patterns.
  const mandatoryMatcher = ignore().add(MANDATORY_EXCLUSIONS);
  const userMatcher = ignore();
  const stliteignorePath = path.join(appDir, ".stliteignore");
  const stliteignore = await fs
    .readFile(stliteignorePath, "utf8")
    .catch(() => null);
  if (stliteignore != null) {
    userMatcher.add(stliteignore);
  }
  const resolvedExcludes = new Set(excludeDirs.map((dir) => path.resolve(dir)));

  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });

  const summary: AppMirrorSummary = {
    fileCount: 0,
    totalBytes: 0,
    largeFiles: [],
    excludedCount: 0,
  };

  const walk = async (relDir: string): Promise<void> => {
    const entries = await fs.readdir(path.join(appDir, relDir), {
      withFileTypes: true,
    });
    for (const entry of entries) {
      const rel = relDir === "" ? entry.name : `${relDir}/${entry.name}`;
      const src = path.join(appDir, relDir, entry.name);
      const matchPath = entry.isDirectory() ? `${rel}/` : rel;
      if (
        resolvedExcludes.has(path.resolve(src)) ||
        mandatoryMatcher.ignores(matchPath) ||
        userMatcher.ignores(matchPath)
      ) {
        summary.excludedCount += 1;
        continue;
      }
      if (entry.isDirectory()) {
        await fs.mkdir(path.join(destDir, rel), { recursive: true });
        await walk(rel);
        continue;
      }
      if (entry.isSymbolicLink()) {
        // Symlinks never survive into the package: the Worker-side archive
        // extraction (tarfile filter="data") rejects unsafe links, and a
        // link named like an excluded directory would bypass the dir-pattern
        // exclusions. Safe in-project file links are dereferenced into
        // regular files below; everything else is a hard error.
        const target = await fs.stat(src).catch(() => null);
        if (target == null) {
          throw new Error(`Broken symlink in the project: ${rel}`);
        }
        const [realSrc, realApp] = await Promise.all([
          fs.realpath(src),
          fs.realpath(appDir),
        ]);
        const realRel = path.relative(realApp, realSrc);
        if (realRel.startsWith("..") || path.isAbsolute(realRel)) {
          throw new Error(
            `Symlink resolves outside the project and cannot be packaged: ${rel} -> ${realSrc}`,
          );
        }
        if (target.isDirectory()) {
          throw new Error(
            `Directory symlinks cannot be packaged: ${rel}. Copy the directory into the project instead.`,
          );
        }
        await fs.copyFile(realSrc, path.join(destDir, rel));
      } else if (entry.isFile()) {
        await fs.cp(src, path.join(destDir, rel));
      } else {
        summary.excludedCount += 1;
        continue;
      }
      const { size } = await fs.stat(path.join(destDir, rel));
      summary.fileCount += 1;
      summary.totalBytes += size;
      if (size >= LARGE_FILE_THRESHOLD) {
        summary.largeFiles.push({ relPath: rel, bytes: size });
      }
    }
  };
  await walk("");
  summary.largeFiles.sort((a, b) => b.bytes - a.bytes);
  return summary;
}

export function formatAppMirrorSummary(summary: AppMirrorSummary): string {
  const mib = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);
  const lines = [
    `Packaged app: ${summary.fileCount} files, ${mib(summary.totalBytes)} MiB` +
      (summary.excludedCount > 0
        ? ` (${summary.excludedCount} entries excluded)`
        : ""),
  ];
  for (const { relPath, bytes } of summary.largeFiles) {
    lines.push(`  large file included: ${relPath} (${mib(bytes)} MiB)`);
  }
  return lines.join("\n");
}
