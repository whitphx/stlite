import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: "./src/index.ts",
    dts: {
      build: true,
    },
    sourcemap: true,
    format: "esm",
  },
  {
    entry: "./src/worker.ts",
    dts: {
      build: true,
    },
    sourcemap: true,
    noExternal: ["@stlite/common", "path-browserify"],
    // The bundled worker file is self-contained and not meant to be imported as an ES module.
    // Moreover, `@stlite/browser` needs to the 'classic' type worker for the file:// protocol compatibility
    // that expects a CJS file.
    // So we build the worker as a CJS file.
    format: "cjs",
    outExtensions(context) {
      if (context.format === "cjs") {
        return {
          js: ".js",
          dts: ".d.ts",
        };
      }
    },
    minify: true,
  },
  {
    entry: "./src/worker-runtime.ts",
    dts: {
      build: true,
    },
    sourcemap: true,
    format: "esm",
    noExternal: ["@stlite/common", "path-browserify"],
    minify: true,
  },
]);
