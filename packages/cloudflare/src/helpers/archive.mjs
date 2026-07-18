import fs from "node:fs/promises";
import path from "node:path";
import { unzipSync } from "fflate";
import * as tar from "tar";

function assertInside(destDir, target, archive) {
  const resolved = path.resolve(destDir, target);
  if (resolved !== destDir && !resolved.startsWith(destDir + path.sep)) {
    throw new Error(
      `Refusing to extract ${target} outside ${destDir} (${archive})`,
    );
  }
  return resolved;
}

/**
 * Extract a .zip archive (e.g. a Python wheel) into destDir. Pure Node so the
 * build needs no system python3/unzip and behaves the same on Windows.
 *
 * @param {string} zipPath
 * @param {string} destDir
 */
export async function extractZip(zipPath, destDir) {
  const buf = await fs.readFile(zipPath);
  const entries = unzipSync(new Uint8Array(buf));
  const absDest = path.resolve(destDir);
  for (const [name, data] of Object.entries(entries)) {
    // Directory entries end with "/" and carry no data; files are created
    // with their parent dirs below, so the explicit dir entries are noise.
    if (name.endsWith("/")) continue;
    const dest = assertInside(absDest, name, zipPath);
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.writeFile(dest, data);
  }
}

/**
 * Extract a .tar.gz archive into destDir. Pure Node so the build needs no
 * system tar and behaves the same on Windows.
 *
 * @param {string} tarPath
 * @param {string} destDir
 */
export async function extractTarGz(tarPath, destDir) {
  await fs.mkdir(destDir, { recursive: true });
  // tar.x refuses paths that escape cwd by default (its `preservePaths` is off).
  await tar.x({ file: tarPath, cwd: destDir });
}
