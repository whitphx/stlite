export function extractCustomComponentPath(
  basePath: string, // basePath without leading and trailing slashes.
  urlString: string,
): string | null {
  const url = new URL(urlString);
  const baseUrl = new URL(basePath, "https://stlite.invalid/"); // TODO: Share the code with @streamlit/connection

  if (url.hostname !== baseUrl.hostname) {
    return null;
  }

  const basePathWithoutTrailingSlash = baseUrl.pathname.replace(/\/$/, "");
  const componentPathRegex = new RegExp(
    `^${basePathWithoutTrailingSlash}(/.*?$)`,
  );
  const matches = url.pathname.match(componentPathRegex);
  if (matches == null) {
    return null;
  }

  const componentPath = matches[1];

  return componentPath + url.search + url.hash;
}

export function getParentPath(pathname: string): string {
  const dirPath = pathname.split("/").slice(0, -1).join("/");
  return dirPath.startsWith("/") ? dirPath : "/" + dirPath;
}

export function getRelativePath(
  baseHost: string,
  basePathname: string,
  url: URL,
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
