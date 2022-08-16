import { DUMMY_BASE_HOST } from "../../consts";

export function extractCustomComponentPath(
  basePathname: string,
  url: string
): string | null {
  const basePath = basePathname.replace(/^\//, "");
  const baseHostAndPath =
    basePath === "" ? DUMMY_BASE_HOST : DUMMY_BASE_HOST + "/" + basePath;
  const regex = new RegExp(`https?://${baseHostAndPath}(/.*?$)`);

  const matches = url.match(regex);
  if (matches == null) {
    return null;
  }

  return matches[1];
}

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
