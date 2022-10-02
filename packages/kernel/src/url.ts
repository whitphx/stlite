import { URLExt } from "@jupyterlab/coreutils";

function isAbsoluteURL(url: string): boolean {
  try {
    new URL(url); // Fails if `url` is relative and the second argument `base` is not given.
    return true;
  } catch {
    return false;
  }
}

export function makeAbsoluteWheelURL(url: string, baseUrl?: string): string {
  if (isAbsoluteURL(url)) {
    return url;
  }

  if (url.startsWith("./")) {
    if (baseUrl == null) {
      throw new Error(`baseUrl is null`);
    }
    return URLExt.join(baseUrl, url);
  }

  const baseOrigin = baseUrl ? new URL(baseUrl).origin : window.location.origin;

  return URLExt.join(baseOrigin, url);
}
