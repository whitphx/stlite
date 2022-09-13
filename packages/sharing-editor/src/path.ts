export function isValidFilePath(filePath: string): boolean {
  if (filePath.trim() !== filePath) {
    return false;
  }
  if (filePath.endsWith("/")) {
    return false;
  }
  if (filePath.includes("./")) {
    return false;
  }
  if (filePath === "") {
    return false;
  }
  return true;
}
