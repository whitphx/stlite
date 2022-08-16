export function getRelativePath(
  baseHost: string,
  basePathname: string,
  url: URL
): string | null {
  const baseDirPathname = basePathname.split("/").slice(0, -1).join("/");
  const isSubUrl =
    url.host === baseHost && url.pathname.startsWith(baseDirPathname);
  if (!isSubUrl) {
    return null;
  }

  const relPath = url.pathname.slice(baseDirPathname.length);
  return relPath.startsWith("/") ? relPath.slice(1) : relPath;
}
