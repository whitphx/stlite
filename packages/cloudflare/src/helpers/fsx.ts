import fs from "node:fs/promises";
import path from "node:path";

/** Whether `target` exists on disk. */
export async function exists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

/**
 * Path of the single wheel in `dir` whose filename matches `pattern`. Zero or
 * multiple matches throw: the wheel dirs this reads are build outputs where a
 * leftover stale wheel would otherwise get vendored silently.
 */
export async function singleWheel(
  dir: string,
  pattern: RegExp,
): Promise<string> {
  const matches = (await fs.readdir(dir))
    .filter((name) => pattern.test(name))
    .sort();
  if (matches.length === 0) {
    throw new Error(`No wheel matching ${pattern} in ${dir}`);
  }
  if (matches.length > 1) {
    throw new Error(
      `Multiple wheels match ${pattern} in ${dir} (${matches.join(", ")}); ` +
        "delete the stale ones and re-run the build.",
    );
  }
  return path.join(dir, matches[0]);
}

/**
 * Make destDir an exact copy of srcDir (equivalent to `rsync -a --delete`),
 * optionally skipping top-level entries whose basename is in `exclude`.
 */
export async function mirrorDir(
  srcDir: string,
  destDir: string,
  { exclude = [] }: { exclude?: string[] } = {},
): Promise<void> {
  const excluded = new Set(exclude);
  await fs.rm(destDir, { recursive: true, force: true });
  await fs.mkdir(destDir, { recursive: true });
  for (const entry of await fs.readdir(srcDir, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    await fs.cp(path.join(srcDir, entry.name), path.join(destDir, entry.name), {
      recursive: true,
    });
  }
}
