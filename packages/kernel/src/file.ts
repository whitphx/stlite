import path from "path-browserify";
import type { PyodideInterface } from "pyodide";

export const globalHomeDir = "/home/pyodide";

export const getAppHomeDir = (appId: string): string =>
  `${globalHomeDir}/${appId}`;

export const resolveAppPath = (
  appId: string | undefined,
  filePath: string,
): string => {
  if (appId == null) {
    return path.resolve(globalHomeDir, filePath);
  }
  return path.resolve(getAppHomeDir(appId), filePath);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PyodideWithFS = PyodideInterface & { FS: any }; // XXX: This is a temporary workaround to fix the type error.

function ensureParent(pyodide: PyodideWithFS, filePath: string): void {
  const normalized = path.normalize(filePath);

  const dirPath = path.dirname(normalized);

  const dirNames = dirPath.split("/");

  const chDirNames: string[] = [];
  for (const dirName of dirNames) {
    chDirNames.push(dirName);
    const dirPath = chDirNames.join("/");

    if (pyodide.FS.analyzePath(dirPath).exists) {
      if (pyodide.FS.isDir(dirPath)) {
        throw new Error(`"${dirPath}" already exists and is not a directory.`);
      }
      continue;
    }

    try {
      pyodide.FS.mkdir(dirPath);
    } catch (err) {
      console.error(`Failed to create a directory "${dirPath}"`);
      throw err;
    }
  }
}

export function writeFileWithParents(
  pyodide: PyodideWithFS,
  filePath: string,
  data: string | ArrayBufferView,
  opts?: unknown,
): void {
  ensureParent(pyodide, filePath);
  pyodide.FS.writeFile(filePath, data, opts);
}

export function renameWithParents(
  pyodide: PyodideWithFS,
  oldPath: string,
  newPath: string,
): void {
  ensureParent(pyodide, newPath);
  pyodide.FS.rename(oldPath, newPath);
}
