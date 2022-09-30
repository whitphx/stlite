import * as fsPromises from "fs/promises";
import * as path from "path";

export async function walkRead(
  dirPath: string,
  relative = true
): Promise<Record<string, Buffer>> {
  const fileContents: Record<string, Buffer> = {};
  const childNames = await fsPromises.readdir(dirPath);
  await Promise.all(
    childNames.map(async (childName) => {
      const childPath = path.join(dirPath, childName);
      const stat = await fsPromises.stat(childPath);
      if (stat.isDirectory()) {
        const childFileContents = await walkRead(childPath, false);
        Object.assign(fileContents, childFileContents);
      } else {
        const fileBin = await fsPromises.readFile(childPath);
        fileContents[childPath] = fileBin;
      }
    })
  );

  if (!relative) {
    return fileContents;
  }

  const relPathFileContents: Record<string, Buffer> = {};
  Object.keys(fileContents).forEach((absPath) => {
    const relPath = path.relative(dirPath, absPath);
    relPathFileContents[relPath] = fileContents[absPath];
  });
  return relPathFileContents;
}
