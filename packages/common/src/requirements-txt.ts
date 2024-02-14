const pipCommentRegexp = /\s#.*$/;

export function parseRequirementsTxt(content: string): string[] {
  return content
    .split("\n")
    .filter((r) => !r.startsWith("#")) // https://pip.pypa.io/en/latest/reference/requirements-file-format/#comments
    .map((r) => r.replace(pipCommentRegexp, "")) // https://pip.pypa.io/en/latest/reference/requirements-file-format/#comments
    .map((r) => r.trim())
    .filter((r) => r !== "");
}
