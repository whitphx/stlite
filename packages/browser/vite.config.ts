import { defineConfig, type Plugin } from "vitest/config";
import react from "@vitejs/plugin-react";
// import react from "@vitejs/plugin-react-swc"
import libAssetsPlugin from "@laynezh/vite-plugin-lib-assets";
import dts from "vite-plugin-dts";
import { visualizer } from "rollup-plugin-visualizer";
import stliteReactPlugin from "@stlite/react/vite-plugin";

import path from "node:path";
import fs from "node:fs";

// Plugin to serve demos with placeholder substitution in dev mode
function demoPlaceholderPlugin(): Plugin {
  return {
    name: "demo-placeholder",
    transformIndexHtml: {
      order: "pre",
      handler(html, ctx) {
        // Only transform demo HTML files
        if (ctx.filename.includes("/demos/")) {
          return html
            .replace(/\{\{STLITE_JS_URL\}\}/g, "/src/index.ts")
            .replace(/\{\{STLITE_CSS_URL\}\}/g, "/src/styles.css");
        }
        return html;
      },
    },
    configureServer(server) {
      // Middleware to serve demo directories (route /demos/xxx/ to /demos/xxx/index.html)
      server.middlewares.use("/demos", (req, res, next) => {
        const urlPath = req.url?.split("?")[0] || "";
        if (urlPath === "" || urlPath === "/" || !urlPath.includes(".")) {
          // This is a directory request, redirect to index.html handled by Vite
          const normalizedPath = urlPath.replace(/\/$/, "");
          req.url = `${normalizedPath}/index.html${req.url?.includes("?") ? req.url.slice(req.url.indexOf("?")) : ""}`;
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: [
    react({
      // jsxImportSource: "@emotion/react",
      // plugins: [["@swc/plugin-emotion", {}]],
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    dts({
      rollupTypes: true,
      bundledPackages: ["@stlite/react"],
    }),
    libAssetsPlugin({
      include: /\.(eot|woff2?|ttf|wasm)$/i,
      limit: 0,
      publicUrl: "./",
    }),
    // Stlite is built with Vite's library-mode (https://vitejs.dev/guide/build.html#library-mode),
    // but the library mode enforces inlining of all the static file assets imported with the `import()` syntax,
    // while we need to disable inlining for the wheel files so that they are served as separate files
    // and their URLs are to be passed to `micropip.install()`.
    // Currently disabling inlining is not supported in the library mode:
    // > If you specify build.lib, build.assetsInlineLimit will be ignored and assets will always be inlined, regardless of file size or being a Git LFS placeholder.
    // > https://vitejs.dev/config/build-options.html#build-assetsinlinelimit
    //
    // and there is an open issue about this: https://github.com/vitejs/vite/issues/4454.
    //
    // As a workaround, we use this 'vite-plugin-lib-assets' plugin to avoid inlining of the wheel files,
    // that was introduced in the above issue discussion as well (https://github.com/vitejs/vite/issues/4454#issuecomment-1627702924)
    libAssetsPlugin({
      include: "**/*.whl",
      outputPath: "wheels",
      // Ensure that *.whl files have proper file names following the wheel file name convention
      // defined in https://packaging.python.org/en/latest/specifications/binary-distribution-format/#file-name-convention
      // so that micropip can recognize them correctly.
      name: "[name].[ext]",
      publicUrl: "./",
    }),
    stliteReactPlugin(),
    // To serve demo files with placeholder substitution for development
    mode === "development" && demoPlaceholderPlugin(),
    // To serve files for development
    mode === "development" && {
      name: "dev-data-server",
      configureServer(server) {
        server.middlewares.use("/dev-files", (req, res, next) => {
          if (req.method === "GET") {
            const filePath = path.resolve(
              __dirname,
              "dev-files",
              req.url?.replace(/^\//, "") || "",
            );

            if (fs.existsSync(filePath)) {
              fs.createReadStream(filePath).pipe(res);
            } else {
              res.statusCode = 404;
              res.end("File not found");
            }
          } else {
            next();
          }
        });
      },
    },
    mode === "production" &&
      visualizer({
        filename: path.resolve(__dirname, "stats/browser.html"),
        template: "treemap",
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
      }),
  ],
  server: {
    open: false,
    port: 3000,
  },
  define: {
    // Vite library mode doesn't replace process.env.NODE_ENV automatically,
    // so we define it manually here.
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  build: {
    outDir: "build",
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "Stlite",
      fileName: "stlite",
      formats: ["es"],
    },
  },
}));
