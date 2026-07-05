import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendDir = path.dirname(fileURLToPath(import.meta.url));

export default {
  resolve: {
    alias: [
      {
        find: /^@stlite\/kernel\/react$/,
        replacement: path.resolve(frontendDir, "remoteRuntimeHooks.tsx"),
      },
    ],
  },
};
