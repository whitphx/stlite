import fs from "node:fs/promises";
import path from "node:path";

/**
 * Validate the app entrypoint and return it as a normalized project-relative
 * POSIX path (the form the vendored `_stlite_entrypoint.py` marker stores, so
 * builds behave identically across host platforms).
 *
 * The entrypoint script gets packaged and executed by the Worker, so it must
 * genuinely live inside the project: absolute paths, `..` traversal, and
 * symlinks that resolve outside the project are rejected rather than silently
 * packaging a file the user didn't intend to publish.
 */
export async function resolveEntrypoint(
  srcDir: string,
  entrypoint: string,
): Promise<string> {
  if (path.isAbsolute(entrypoint)) {
    throw new Error(
      `--entrypoint must be a path relative to the project directory, got an absolute path: ${entrypoint}`,
    );
  }
  const abs = path.resolve(srcDir, entrypoint);
  const rel = path.relative(srcDir, abs);
  if (rel === "" || rel.startsWith("..")) {
    throw new Error(
      `--entrypoint must stay inside the project directory: ${entrypoint}`,
    );
  }

  const stat = await fs.stat(abs).catch(() => null);
  if (stat == null) {
    throw new Error(
      `Entrypoint not found: ${entrypoint} (looked in ${srcDir})`,
    );
  }
  if (!stat.isFile()) {
    throw new Error(`Entrypoint is not a regular file: ${entrypoint}`);
  }

  const [realAbs, realSrc] = await Promise.all([
    fs.realpath(abs),
    fs.realpath(srcDir),
  ]);
  const realRel = path.relative(realSrc, realAbs);
  if (realRel.startsWith("..") || path.isAbsolute(realRel)) {
    throw new Error(
      `Entrypoint resolves outside the project directory: ${entrypoint} -> ${realAbs}`,
    );
  }

  return rel.split(path.sep).join("/");
}
