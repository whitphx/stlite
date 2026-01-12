/**
 * Vite configuration for building demo pages.
 * This builds the demo apps for E2E testing and preview deployments.
 */

import { mergeConfig } from "vite";
import path from "node:path";

import baseConfig from "../demos/vite.config";

// Demo source files are in the parent directory
const reactPackageDir = path.resolve(__dirname, "..");

export default mergeConfig(baseConfig, {
  root: reactPackageDir,
  base: "./",
  build: {
    outDir: path.resolve(__dirname, "demo-dist"),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(reactPackageDir, "index.html"),
        basic: path.resolve(reactPackageDir, "demos/basic/index.html"),
        "multi-app": path.resolve(
          reactPackageDir,
          "demos/multi-app/index.html",
        ),
        "multi-app-shared-worker": path.resolve(
          reactPackageDir,
          "demos/multi-app-shared-worker/index.html",
        ),
      },
    },
  },
});
