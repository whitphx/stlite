import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    typecheck: {
      enabled: true,
    },
    alias: {
      "@streamlit/lib": path.resolve(__dirname, "./mock/empty.js"),
      "@streamlit/protobuf": path.resolve(__dirname, "./mock/empty.js"),
      "@streamlit/connection": path.resolve(__dirname, "./mock/empty.js"),
    },
  },
});
