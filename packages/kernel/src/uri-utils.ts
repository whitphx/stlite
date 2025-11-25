// Ref: https://github.com/streamlit/streamlit/blob/1.12.2/frontend/src/lib/UriUtil.ts#L32-L33
// The original implementation was from above,
// but we improved it inspired by https://codeql.github.com/codeql-query-help/javascript/js-polynomial-redos/
const FINAL_SLASH_RE = /(?<!\/)\/+$/;
const INITIAL_SLASH_RE = /^\/+/;
export function normalizeBasePath(basePath: string): string {
  return basePath.replace(FINAL_SLASH_RE, "").replace(INITIAL_SLASH_RE, "");
}
