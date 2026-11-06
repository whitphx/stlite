import fs from "node:fs/promises";

/**
 * Loads already-built JavaScript together with the sourcemap next to it, so
 * the bundle's sourcemaps point through it to its original sources.
 *
 * The packages that bundle @stlite/react's build exclude it from
 * @vitejs/plugin-react's Babel pass, which would only re-parse and reprint
 * it. That pass was also what read the build's own sourcemaps, which neither
 * Vite nor Rolldown does by itself; this plugin does that part alone, so the
 * published sourcemaps still lead to @stlite/react's original sources.
 *
 * @param {RegExp} include Module ids to load this way.
 * @returns {import("vite").Plugin}
 */
export default function viteInputSourcemaps(include) {
  return {
    name: "stlite:input-sourcemaps",
    enforce: "pre",
    async load(id) {
      const file = id.split("?")[0];
      if (!file.endsWith(".js") || !include.test(file)) {
        return null;
      }
      let map;
      try {
        map = await fs.readFile(`${file}.map`, "utf8");
      } catch {
        return null;
      }
      return { code: await fs.readFile(file, "utf8"), map };
    },
  };
}
