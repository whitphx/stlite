export function isDescendantURL(
  ancestorURL: string,
  descendantURL: string,
): boolean {
  // To resolve things like "..", etc, parse the URLs with the URL class.
  const ancestorUrl = new URL(ancestorURL);
  const descendantUrl = new URL(descendantURL);

  return descendantUrl.toString().startsWith(ancestorUrl.toString());
}
