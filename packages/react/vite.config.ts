import { resolve } from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      name: "StliteReact",
      fileName: (format) => {
        if (format === "es") return "stlite-react.mjs";
        if (format === "umd") return "stlite-react.umd.cjs";
        return `stlite-react.${format}.js`; // Fallback, though 'es' and 'umd' are expected
      },
      formats: ["es", "umd"], // Explicitly specify desired formats
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["react", "react-dom", "@stlite/browser"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@stlite/browser": "StliteBrowser", // Assuming this is the global for @stlite/browser
        },
        // Ensure that 'style.css' is output directly at the root of 'dist/'
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") {
            return "style.css";
          }
          return assetInfo.name || "";
        },
      },
    },
  },
});