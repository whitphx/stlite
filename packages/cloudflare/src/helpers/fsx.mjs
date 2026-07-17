import fs from "node:fs/promises";
import path from "node:path";

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
