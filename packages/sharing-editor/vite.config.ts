/*eslint-env node*/
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import selfPackageJson from "./package.json";

const selfPackageVersion = selfPackageJson.version;

export default defineConfig({
  plugins: [react()],
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
    typecheck: {
      enabled: true,
    },
  },
});
