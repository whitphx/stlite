import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@streamlit/lib": path.resolve(
        __dirname,
        "../../streamlit/frontend/lib/src",
      ),
    },
  },
  test: {
    environment: "jsdom",
    typecheck: {
      enabled: true,
    },
  },
});
