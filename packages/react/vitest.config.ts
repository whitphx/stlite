import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: ["e2e-tests/**"],
    typecheck: {
      enabled: true,
    },
    alias: {
      "@streamlit/lib": path.resolve(__dirname, "./mock/empty.js"),
    },
  },
});
