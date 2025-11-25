// Ref: https://github.com/streamlit/streamlit/blob/1.12.2/frontend/src/lib/UriUtil.ts#L32-L33
const FINAL_SLASH_RE = /\/+$/;
const INITIAL_SLASH_RE = /^\/+/;
export function normalizeBasePath(basePath: string): string {
  return basePath.replace(FINAL_SLASH_RE, "").replace(INITIAL_SLASH_RE, "");
}
