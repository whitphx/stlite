import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendDir = path.dirname(fileURLToPath(import.meta.url));

export default {
  // Source maps are dead weight here: this build is vendored into the Worker
  // (and, once bundled, into the published package), never served to a browser
  // devtools session, so emitting them only inflates the artifact.
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
