/*eslint-env node*/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import path from "node:path";
import selfPackageJson from "./package.json";

const selfPackageVersion = selfPackageJson.version;

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "production" &&
      visualizer({
        filename: path.resolve(__dirname, "stats/sharing-editor.html"),
        template: "treemap",
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
      }),
  ],
  define: {
    SHARING_APP_URL: JSON.stringify(process.env.SHARING_APP_URL),
    RESOLVE_SHARING_APP_URL_RUNTIME_FROM_EXTERNAL_FILE: JSON.stringify(
      process.env.RESOLVE_SHARING_APP_URL_RUNTIME_FROM_EXTERNAL_FILE,
    ),
    SELF_HOSTING_RUNTIME_VERSION: JSON.stringify(
      selfPackageVersion ?? "0.75.0",
    ),
    GITHUB_SHA: JSON.stringify(process.env.GITHUB_SHA ?? "(unavailable)"),
  },
  build: {
    sourcemap: true,
  },
  test: {
    environment: "jsdom",
  },
}));
