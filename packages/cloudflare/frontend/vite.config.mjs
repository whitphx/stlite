import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendDir = path.dirname(fileURLToPath(import.meta.url));

export default {
  // The upstream config decides sourcemaps from env vars, so pin them off:
  // .map files would be vendored into every Worker bundle (and the published
  // package's runtime/), inflating artifacts that must stay under Cloudflare's
  // Worker size limit.
  build: {
    sourcemap: false,
  },
  resolve: {
    alias: [
      {
        find: /^@stlite\/kernel\/react$/,
        replacement: path.resolve(frontendDir, "remoteRuntimeHooks.tsx"),
      },
    ],
  },
};
