// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import stliteReactPlugin from "@stlite/react/vite-plugin";

export default defineConfig({
  plugins: [react(), stliteReactPlugin()],
});
