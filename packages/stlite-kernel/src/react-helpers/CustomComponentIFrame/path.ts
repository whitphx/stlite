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
