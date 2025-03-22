import path from "path-browserify";
import type { PyodideInterface } from "pyodide";

export const globalHomeDir = "/home/pyodide";

export const getAppHomeDir = (appId: string | undefined): string =>
  appId == null ? globalHomeDir : path.join(globalHomeDir, appId);

export const resolveAppPath = (
  appId: string | undefined,
  filePath: string,
): string => {
  if (appId == null) {
    return path.resolve(globalHomeDir, filePath);
  }
  return path.resolve(getAppHomeDir(appId), filePath);
};

function ensureParent(
  pyodide: PyodideInterface & { FS: any }, // XXX: This is a temporary workaround to fix the type error.
  filePath: string,
): void {
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
  pyodide: PyodideInterface & { FS: any }, // XXX: This is a temporary workaround to fix the type error.
  filePath: string,
  data: string | ArrayBufferView,
  opts?: unknown,
): void {
  ensureParent(pyodide, filePath);
  pyodide.FS.writeFile(filePath, data, opts);
}

export function renameWithParents(
  pyodide: PyodideInterface & { FS: any }, // XXX: This is a temporary workaround to fix the type error.
  oldPath: string,
  newPath: string,
): void {
  ensureParent(pyodide, newPath);
  pyodide.FS.rename(oldPath, newPath);
}

function relPathInDir(filePath: string, targetDir: string): string | null {
  const relative = path.relative(targetDir, filePath);
  if (
    relative !== "" &&
    !relative.startsWith("..") &&
    !path.isAbsolute(relative)
  ) {
    return relative;
  }

  return null;
}

function isAllowedPath(filePath: string, allowedDotPaths: string[]): boolean {
  return filePath.split(path.sep).every((part) => {
    if (part.startsWith(".")) {
      return allowedDotPaths.includes(part);
    }
    return true;
  });
}

export function monitorFiles(
  pyodide: PyodideInterface & { FS: any }, // XXX: This is a temporary workaround to fix the type error.
  targetDirPath: string,
  allowedDotPaths: string[],
  callbacks: {
    onWritten: (filePath: string) => void;
    onDeleted: (filePath: string) => void;
    onMoved: (oldFilePath: string, newFilePath: string) => void;
  },
): void {
  pyodide.FS.trackingDelegate["onDeletePath"] = function (path: string) {
    const relPath = relPathInDir(path, targetDirPath);
    if (relPath == null) {
      return;
    }

    if (isAllowedPath(relPath, allowedDotPaths)) {
      callbacks.onDeleted(relPath);
    }
  };

  pyodide.FS.trackingDelegate["onMovePath"] = function (
    oldpath: string,
    newpath: string,
  ) {
    const relOldPath = relPathInDir(oldpath, targetDirPath);
    const relNewPath = relPathInDir(newpath, targetDirPath);
    if (relOldPath == null || relNewPath == null) {
      return;
    }

    if (
      isAllowedPath(relOldPath, allowedDotPaths) &&
      isAllowedPath(relNewPath, allowedDotPaths)
    ) {
      callbacks.onMoved(relOldPath, relNewPath);
    }
  };

  const openedFiles = new Set<string>();
  pyodide.FS.trackingDelegate["onOpenFile"] = function (
    path: string,
    flags: number,
  ) {
    openedFiles.add(path);
  };

  const writtenFiles = new Set<string>();
  pyodide.FS.trackingDelegate["onWriteToFile"] = function (
    path: string,
    bytesWritten: number,
  ) {
    if (openedFiles.has(path)) {
      writtenFiles.add(path);
    }
  };

  pyodide.FS.trackingDelegate["onCloseFile"] = function (path: string) {
    const relPath = relPathInDir(path, targetDirPath);
    if (relPath == null) {
      return;
    }

    if (isAllowedPath(relPath, allowedDotPaths)) {
      if (writtenFiles.has(path)) {
        callbacks.onWritten(relPath);
      }
    }

    openedFiles.delete(path);
    writtenFiles.delete(path);
  };
}
