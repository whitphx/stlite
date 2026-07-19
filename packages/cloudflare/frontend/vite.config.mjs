export default {
  // The upstream config decides sourcemaps from env vars, so pin them off:
  // .map files would be vendored into every Worker bundle (and the published
  // package's runtime/), inflating artifacts that must stay under Cloudflare's
  // Worker size limit.
  build: {
    sourcemap: false,
  },
  // No aliases: the real @stlite/kernel/react is bundled, and its hooks fall
  // back to upstream server-backed behavior when no kernel is in context
  // (which is always the case in this build — nothing mounts a
  // StliteKernelProvider here).
};
