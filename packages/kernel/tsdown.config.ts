import { defineConfig } from "tsdown";

export default defineConfig([
  {
    entry: "./src/index.ts",
    dts: {
      build: true,
    },
    sourcemap: true,
  },
  {
    entry: "./src/worker.ts",
    dts: {
      build: true,
    },
    sourcemap: true,
    noExternal: ["@stlite/common", "path-browserify"],
  },
]);
