import fs from "node:fs/promises";
import path from "node:path";

/** Whether `target` exists on disk. */
export async function exists(target) {
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
 *
 * @param {string} dir
 * @param {RegExp} pattern
 * @returns {Promise<string>}
 */
export async function singleWheel(dir, pattern) {
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
 *
 * @param {string} srcDir
 * @param {string} destDir
 * @param {{ exclude?: string[] }} [options]
 */
export async function mirrorDir(srcDir, destDir, { exclude = [] } = {}) {
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

/**
 * Remove top-level entries of dir whose name satisfies `predicate` (equivalent
 * to `find dir -maxdepth 1 -name … -exec rm -rf`). No-op for names that don't
 * match; missing dir throws (callers pass a dir the vendoring just populated).
 *
 * @param {string} dir
 * @param {(name: string) => boolean} predicate
 */
export async function removeMatching(dir, predicate) {
  for (const name of await fs.readdir(dir)) {
    if (predicate(name)) {
      await fs.rm(path.join(dir, name), { recursive: true, force: true });
    }
  }
}
