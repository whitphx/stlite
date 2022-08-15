export function extractCustomComponentPath(url: string): string | null {
  const matches = url.match(/https?:\/\/xxx:99999(\/.*?)\?.*/);
  if (matches == null) {
    return null;
  }

  return matches[1];
}
