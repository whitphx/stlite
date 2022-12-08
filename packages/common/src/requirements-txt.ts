export function parseRequirementsTxt(content: string): string[] {
  return content
    .split("\n")
    .map((r) => r.trim())
    .filter((r) => r !== "");
}
