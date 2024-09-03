export function isDescendantURL(
  ancestorURL: string,
  descendantURL: string
): boolean {
  // To resolve things like "..", etc, parse the URLs with the URL class.
  const ancestorUrl = new URL(ancestorURL);
  const descendantUrl = new URL(descendantURL);

  ancestorUrl.search = "";
  ancestorUrl.hash = "";
  descendantUrl.search = "";
  descendantUrl.hash = "";

  return descendantUrl.toString().startsWith(ancestorUrl.toString());
}
