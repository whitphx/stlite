import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.tsx",
      name: "StliteReact",
      formats: ["es", "umd"],
      fileName: (format) => `stlite-react.${format === "es" ? "mjs" : "umd.cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "@stlite/browser"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@stlite/browser": "StliteBrowser", // Assuming StliteBrowser is the global name for @stlite/browser
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "style.css";
          }
          return assetInfo.name ?? "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});