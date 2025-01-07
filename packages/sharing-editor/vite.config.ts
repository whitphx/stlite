/*eslint-env node*/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import selfPackageJson from "./package.json";

const selfPackageVersion = selfPackageJson.version;

export default defineConfig({
  plugins: [react()],
  define: {
    SHARING_APP_URL: JSON.stringify(
      process.env.SHARING_APP_URL ?? "http://localhost:3000/",
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
});
