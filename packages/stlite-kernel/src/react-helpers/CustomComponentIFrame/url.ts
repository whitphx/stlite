import { DUMMY_BASE_HOST } from "../../consts";

export function extractCustomComponentPath(
  basePath: string, // basePath without leading and trailing slashes.
  url: string
): string | null {
  const baseHostAndPath = (DUMMY_BASE_HOST + "/" + basePath).replace(/\/$/, "");
  const regex = new RegExp(`https?://${baseHostAndPath}(/.*?$)`);

  const matches = url.match(regex);
  if (matches == null) {
    return null;
  }

  return matches[1];
}

export function getParentPath(pathname: string): string {
  const dirPath = pathname.split("/").slice(0, -1).join("/");
  return dirPath.startsWith("/") ? dirPath : "/" + dirPath;
}

export function getRelativePath(
  baseHost: string,
  basePathname: string,
  url: URL
): string | null {
  const baseDirPathname = getParentPath(basePathname);
  const isSubUrl =
    url.host === baseHost && url.pathname.startsWith(baseDirPathname);
  if (!isSubUrl) {
    return null;
  }

  const relPath = url.pathname.slice(baseDirPathname.length);
  return relPath.startsWith("/") ? relPath.slice(1) : relPath;
}
