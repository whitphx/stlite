export function getParentUrl(url: string): string {
  const parentURL = url.split("/").slice(0, -1).join("/") + "/";

  try {
    return new URL(parentURL).toString(); // If `parentURL` is an absolute URL, this passes.
  } catch {
    return new URL(parentURL, window.location.origin).toString();
  }
}
