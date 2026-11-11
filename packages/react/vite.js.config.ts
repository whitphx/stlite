// `vite.config.ts` without the declaration-file plugin: what `yarn build`
// bundles, while `vite.types.config.ts` generates the declarations in a
// process of its own. The plugin type-checks and emits the whole program,
// including the Streamlit frontend's sources, for a third of the build's time,
// on the same thread as the bundling; split, the two run side by side.
import { defineConfig, type PluginOption, type UserConfig } from "vite";
import baseConfig from "./vite.config";

export const DTS_PLUGIN_NAME = "unplugin-dts";

export function isDtsPlugin(plugin: PluginOption): boolean {
  return (
    typeof plugin === "object" &&
    plugin !== null &&
    "name" in plugin &&
    plugin.name === DTS_PLUGIN_NAME
  );
}

export default defineConfig((env) => {
  const config = baseConfig(env) as UserConfig;
  const plugins = (config.plugins ?? []).flat(Infinity) as PluginOption[];
  if (!plugins.some(isDtsPlugin)) {
    throw new Error(`${DTS_PLUGIN_NAME} is no longer in vite.config.ts`);
  }
  return {
    ...config,
    plugins: plugins.filter((plugin) => !isDtsPlugin(plugin)),
  };
});
