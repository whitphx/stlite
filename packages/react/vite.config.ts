import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: "src/index.tsx",
      name: "StliteReact",
      formats: ["es", "umd"],
      fileName: (format) => {
        if (format === "es") return "stlite-react.mjs";
        if (format === "umd") return "stlite-react.umd.cjs";
        return `stlite-react.${format}.js`; // Fallback
      },
    },
    rollupOptions: {
      external: ["react", "react-dom", "@stlite/browser"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@stlite/browser": "StliteBrowser", // Assuming @stlite/browser exports a UMD global named StliteBrowser
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "style.css";
          }
          return assetInfo.name ?? "assets/[name]-[hash][extname]"; // More robust fallback
        },
      },
    },
  },
});