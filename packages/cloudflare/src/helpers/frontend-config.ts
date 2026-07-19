// The index HTML is served by Cloudflare's static-assets layer, not the
// Python Worker, so the Streamlit frontend config is baked in at build time.
// The injected script computes its URLs in the browser, making build-time
// injection byte-equivalent to serve-time injection.
const MODULE_SCRIPT_MARKER = '<script type="module" ';
const CLOUDFLARE_FRONTEND_CONFIG = `<script>
window.__streamlit = {
  ...(window.__streamlit ?? {}),
  BACKEND_BASE_URL: new URL("/", window.location.href).toString(),
  MAIN_PAGE_BASE_URL: new URL("/", window.location.href).toString(),
}
</script>
`;

/**
 * Insert the Cloudflare frontend config in front of the index HTML's first
 * module-script tag. Throws when the marker is absent so a Vite upgrade that
 * changes the emitted script-tag shape fails the build instead of silently
 * shipping an unconfigured frontend.
 */
export function injectFrontendConfig(indexHtml: string): string {
  if (!indexHtml.includes(MODULE_SCRIPT_MARKER)) {
    throw new Error(
      `The built index.html does not contain ${JSON.stringify(MODULE_SCRIPT_MARKER)}; ` +
        "update MODULE_SCRIPT_MARKER in src/helpers/frontend-config.ts to match " +
        "the new output.",
    );
  }
  return indexHtml.replace(
    MODULE_SCRIPT_MARKER,
    CLOUDFLARE_FRONTEND_CONFIG + MODULE_SCRIPT_MARKER,
  );
}
