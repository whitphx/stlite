import * as fsPromises from "fs/promises";
import * as path from "path";

/**
 * Returns an object whose keys are absolute paths of the files and values are the file contents.
 * Note that the paths are OS-specific, "/" for POSIX and "\" for Windows,
 * so this function is only expected to be called from `walkRead()` that converts the paths to be POSIX.
 */
async function walkReadAbsPath(
  dirPath: string
): Promise<Record<string, Buffer>> {
  const fileContents: Record<string, Buffer> = {};
  const childNames = await fsPromises.readdir(dirPath);
  await Promise.all(
    childNames.map(async (childName) => {
      const childPath = path.join(dirPath, childName);
      const stat = await fsPromises.stat(childPath);
      if (stat.isDirectory()) {
        const childFileContents = await walkReadAbsPath(childPath);
        Object.assign(fileContents, childFileContents);
      } else {
        const fileBin = await fsPromises.readFile(childPath);
        fileContents[childPath] = fileBin;
      }
    })
  );

  return fileContents;
}

export async function walkRead(
  dirPath: string
): Promise<Record<string, Buffer>> {
  const fileContents = await walkReadAbsPath(dirPath);

  const relPathFileContents: Record<string, Buffer> = {};
  Object.keys(fileContents).forEach((absPath) => {
    const relPath = path.relative(dirPath, absPath);
    const posixRelPath = relPath.split(path.sep).join(path.posix.sep); // Convert the path separators on Windows to POSIX ones.
    relPathFileContents[posixRelPath] = fileContents[absPath];
  });
  return relPathFileContents;
}
