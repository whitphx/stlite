import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point to source packages so tests can run before building dependency workspaces.
      "@streamlit/lib": path.resolve(
        __dirname,
        "../../streamlit/frontend/lib/src",
      ),
      "@streamlit/connection": path.resolve(
        __dirname,
        "../../streamlit/frontend/connection/src",
      ),
      "@streamlit/protobuf": path.resolve(
        __dirname,
        "../../streamlit/frontend/protobuf",
      ),
      "@stlite/kernel": path.resolve(__dirname, "../kernel/src"),
    },
  },
  test: {
    environment: "jsdom",
    typecheck: {
      enabled: true,
    },
  },
});
