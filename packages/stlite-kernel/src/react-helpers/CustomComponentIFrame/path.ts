export function extractCustomComponentPath(
  basePathname: string,
  url: string
): string | null {
  const basePath = basePathname.replace(/^\//, "");
  const baseHostAndPath =
    basePath === "" ? "xxx:99999" : "xxx:99999/" + basePath;
  const regex = new RegExp(`https?://${baseHostAndPath}(/.*?$)`);

  const matches = url.match(regex);
  if (matches == null) {
    return null;
  }

  return matches[1];
}
