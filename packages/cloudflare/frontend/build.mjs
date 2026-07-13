import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const cloudflareFrontendDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.dirname(cloudflareFrontendDir);
const rootDir = path.resolve(packageDir, "../..");
const streamlitFrontendDir = path.join(rootDir, "streamlit/frontend");
const streamlitAppDir = path.join(streamlitFrontendDir, "app");

const viteApiUrl = pathToFileURL(
  path.join(streamlitFrontendDir, "node_modules/vite/dist/node/index.js"),
).href;
const { build, loadConfigFromFile, mergeConfig } = await import(viteApiUrl);

const configEnv = {
  command: "build",
  mode: process.env.MODE ?? "production",
  isSsrBuild: false,
  isPreview: false,
};

const streamlitConfig = await loadConfigFromFile(
  configEnv,
  path.join(streamlitAppDir, "vite.config.ts"),
  streamlitAppDir,
);
if (!streamlitConfig) {
  throw new Error("Failed to load Streamlit frontend Vite config");
}

const cloudflareConfig = await loadConfigFromFile(
  configEnv,
  path.join(cloudflareFrontendDir, "vite.config.mjs"),
  streamlitAppDir,
);
if (!cloudflareConfig) {
  throw new Error("Failed to load Cloudflare frontend Vite config");
}

await build(
  mergeConfig(mergeConfig(streamlitConfig.config, cloudflareConfig.config), {
    configFile: false,
    root: streamlitAppDir,
  }),
);

// stlite_cloudflare.frontend_config injects the backend config in front of
// this marker at serve time and silently no-ops when it is absent, so a Vite
// upgrade that changes the emitted script-tag shape must fail here instead.
const moduleScriptMarker = '<script type="module" ';
const indexHtml = await fs.readFile(
  path.join(streamlitAppDir, "build/index.html"),
  "utf8",
);
if (!indexHtml.includes(moduleScriptMarker)) {
  throw new Error(
    `The built index.html no longer contains ${JSON.stringify(moduleScriptMarker)}; ` +
      "update _MODULE_SCRIPT_MARKER in py/stlite_cloudflare/frontend_config.py " +
      "to match the new output.",
  );
}
