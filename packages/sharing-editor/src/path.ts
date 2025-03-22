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

const TEXT_EXTS = [
  ".py",
  ".txt",
  ".csv",
  ".md",
  ".json",
  ".yml",
  ".yaml",
  ".toml",
];

export function isTextExtPath(path: string): boolean {
  return TEXT_EXTS.some((text_ext) => path.endsWith(text_ext));
}
