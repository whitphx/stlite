import fs from "node:fs/promises";
import path from "node:path";
import { injectFrontendConfig } from "./helpers/frontend-config.ts";
import { exists, mirrorDir, singleWheel } from "./helpers/fsx.ts";
import { runVendorPythonModules } from "./helpers/python.ts";
import { run } from "./helpers/spawn.ts";
import { vendorPrebuiltPackages } from "./vendor-prebuilt.ts";

export interface VendorOptions {
  /** The @stlite/cloudflare package root. */
  packageDir: string;
  /** The scaffolded output project (gets python_modules). */
  projectDir: string;
  /** The user's Streamlit project directory. */
  appDir: string;
  /** Reusable cache dir (Pyodide wheels). */
  cacheDir: string;
  /** App entry script name (default streamlit_app.py). */
  entrypoint?: string;
  /** Keep the whole runtime in the Worker script instead of loading it from
   * static assets at cold start. */
  bundledRuntime?: boolean;
}

/**
 * Vendor the stlite runtime and the user's project into a deployable Cloudflare
 * Worker directory. Cross-platform; the external processes it spawns are `uv`
 * (pywrangler + the Python vendoring helper).
 *
 * Requires the prebuilt runtime artifacts under runtime/ (frontend, wheels, and
 * the Streamlit dependency snapshot). A published @stlite/cloudflare ships them;
 * in the Stlite monorepo run `make cloudflare` first.
 */
export async function vendor({
  packageDir,
  projectDir,
  appDir,
  cacheDir,
  entrypoint = "streamlit_app.py",
  bundledRuntime = false,
}: VendorOptions): Promise<void> {
  const vendorDir = path.join(projectDir, "python_modules");
  await fs.mkdir(cacheDir, { recursive: true });

  const runtimeDir = path.join(packageDir, "runtime");
  if (!(await exists(path.join(runtimeDir, "frontend")))) {
    throw new Error(
      "stlite-cloudflare is missing its prebuilt runtime artifacts (runtime/). " +
        "A published @stlite/cloudflare ships them; in the Stlite monorepo, run " +
        "`make cloudflare` first.",
    );
  }
  const frontendSrc = path.join(runtimeDir, "frontend");
  const wheelsDir = path.join(runtimeDir, "wheels");

  // Resolve the user's own dependencies for the Pyodide target and install them.
  await run("uv", ["run", "--project", ".", "pywrangler", "sync", "--force"], {
    cwd: projectDir,
  });

  // Vendor the Streamlit fork's prebuilt Pyodide dependency closure on top.
  await vendorPrebuiltPackages({ packageDir, projectDir, cacheDir });

  // Drop stray pyarrow copies and install the pinned fork wheels over whatever
  // streamlit/stlite_lib pywrangler or the snapshot vendored.
  await runVendorPythonModules(packageDir, projectDir, [
    "install-runtime",
    "--vendor-dir",
    vendorDir,
    await singleWheel(wheelsDir, /^stlite_lib-.*-py3-none-any\.whl$/),
    await singleWheel(wheelsDir, /^streamlit-.*-py3-none-any\.whl$/),
  ]);
  await fs.cp(
    path.join(packageDir, "py", "stlite_cloudflare"),
    path.join(vendorDir, "stlite_cloudflare"),
    { recursive: true },
  );

  // The frontend is served by Cloudflare's static-assets layer (wrangler.jsonc
  // `assets`), not the Python Worker: static files don't count against the
  // Worker's 64 MiB script limit there. The Streamlit config is baked into the
  // index HTML here since no server-side injection happens anymore.
  const assetsDir = path.join(projectDir, "assets");
  await mirrorDir(frontendSrc, assetsDir);
  const indexPath = path.join(assetsDir, "index.html");
  await fs.writeFile(
    indexPath,
    injectFrontendConfig(await fs.readFile(indexPath, "utf8")),
  );

  // Vendor the app, then write the package marker + entrypoint marker (after the
  // mirror, which would otherwise delete them).
  const appVendorDir = path.join(vendorDir, "_stlite_cloudflare_app");
  await mirrorDir(appDir, appVendorDir);
  await ensureFile(path.join(appVendorDir, "__init__.py"));
  await fs.writeFile(
    path.join(appVendorDir, "_stlite_entrypoint.py"),
    `ENTRYPOINT = ${JSON.stringify(entrypoint)}\n`,
  );

  // Move the heavy runtime (streamlit, stlite_lib, deps, the app) out of the
  // Worker script and into static assets the Worker activates at cold start —
  // script bytes are capped at 3/10 MiB gzip, which this closure exceeds by
  // itself; assets are not. With bundledRuntime everything stays in the
  // script (the boot loader detects this and skips the asset fetch), which
  // needs Cloudflare's planned 64 MB-uncompressed limit:
  // https://github.com/cloudflare/workers-py/issues/156
  if (!bundledRuntime) {
    await runVendorPythonModules(packageDir, projectDir, [
      "pack-modules",
      "--vendor-dir",
      vendorDir,
      "--dest-dir",
      path.join(assetsDir, "_stlite"),
    ]);
  }
}

async function ensureFile(filePath: string): Promise<void> {
  if (!(await exists(filePath))) {
    await fs.writeFile(filePath, "");
  }
}
