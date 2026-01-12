/**
 * Vite configuration for building demo pages.
 * This builds the demo apps for E2E testing and preview deployments.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import stliteReactPlugin from "@stlite/react/vite-plugin";

import path from "node:path";

// Demo source files are in the parent directory
const reactPackageDir = path.resolve(__dirname, "..");

export default defineConfig({
  root: reactPackageDir,
  base: "./",
  plugins: [react(), stliteReactPlugin()],
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
        "shared-worker": path.resolve(
          reactPackageDir,
          "demos/shared-worker/index.html",
        ),
      },
    },
  },
});
