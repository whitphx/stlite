export function parseRequirementsTxt(content: string): string[] {
  return content
    .split("\n")
    .filter((r) => !r.startsWith("#"))
    .map((r) => r.trim())
    .filter((r) => r !== "");
}
