// Ref: https://github.com/streamlit/streamlit/blob/1.12.2/frontend/src/lib/UriUtil.ts#L32-L33
// The original implementation was from above,
// but we improved it inspired by https://codeql.github.com/codeql-query-help/javascript/js-polynomial-redos/
const LEADING_AND_TRAILING_SLASH_RE = /^\/+|(?<!\/)\/+$/g;
export function normalizeBasePath(basePath: string): string {
  return basePath.replace(LEADING_AND_TRAILING_SLASH_RE, "");
}
