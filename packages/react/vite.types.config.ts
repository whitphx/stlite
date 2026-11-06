// Only the declaration-file plugin of `vite.config.ts`, with the same options,
// writing to build-types/; `yarn build` runs it beside `vite.js.config.ts` and
// copies the declarations into build/. The plugin builds its declarations from
// the TypeScript program, not from the bundle, so everything outside src/ is
// left external here and the bundle it makes (and discards) takes seconds.
import path from "node:path";
import { defineConfig, type PluginOption, type UserConfig } from "vite";
import baseConfig from "./vite.config";
import { isDtsPlugin } from "./vite.js.config";

const srcDir = path.resolve(__dirname, "src");

export default defineConfig((env) => {
  const config = baseConfig(env) as UserConfig;
  const plugins = (
    (config.plugins ?? []).flat(Infinity) as PluginOption[]
  ).filter(isDtsPlugin);
  if (plugins.length !== 1) {
    throw new Error("Expected one declaration-file plugin in vite.config.ts");
  }
  return {
    ...config,
    plugins,
    build: {
      ...config.build,
      // Inside the package, where the plugin's bundling of the declarations
      // resolves the workspace packages it inlines.
      outDir: "build-types",
      sourcemap: false,
      rollupOptions: {
        external: (id, importer) =>
          importer !== undefined &&
          !id.startsWith(".") &&
          !id.startsWith(srcDir),
      },
    },
  };
});
