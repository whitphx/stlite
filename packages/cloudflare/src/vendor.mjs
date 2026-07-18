import fs from "node:fs/promises";
import path from "node:path";
import { extractZip } from "./helpers/archive.mjs";
import { exists, mirrorDir, removeMatching } from "./helpers/fsx.mjs";
import { run } from "./helpers/spawn.mjs";

const isPyarrowArtifact = (name) =>
  name === "pyarrow" ||
  name === "pyarrow.libs" ||
  /^pyarrow-.*\.dist-info$/.test(name);
const isRuntimeArtifact = (name) =>
  name === "stlite_cloudflare" ||
  name === "stlite_lib" ||
  name === "streamlit" ||
  /^(stlite_lib|streamlit)-.*\.dist-info$/.test(name);

/**
 * Vendor the stlite runtime and the user's project into a deployable Cloudflare
 * Worker directory. Cross-platform; the only external process it spawns is
 * `uv`/`pywrangler`.
 *
 * Requires the prebuilt runtime artifacts (runtime/ + the dist/ vendoring
 * bundle). A published @stlite/cloudflare ships them; in the Stlite monorepo run
 * `make cloudflare` first — the raw source tree can't be built from directly.
 *
 * @param {object} opts
 * @param {string} opts.packageDir  The @stlite/cloudflare package root.
 * @param {string} opts.projectDir  The scaffolded output project (gets python_modules).
 * @param {string} opts.appDir      The user's Streamlit project directory.
 * @param {string} opts.cacheDir    Reusable cache dir (Pyodide wheels).
 * @param {string} [opts.entrypoint] App entry script name (default streamlit_app.py).
 */
export async function vendor({
  packageDir,
  projectDir,
  appDir,
  cacheDir,
  entrypoint = "streamlit_app.py",
}) {
  const vendorDir = path.join(projectDir, "python_modules");
  await fs.mkdir(cacheDir, { recursive: true });

  const runtimeDir = path.join(packageDir, "runtime");
  if (
    !(await exists(path.join(runtimeDir, "frontend"))) ||
    !(await exists(path.join(packageDir, "dist", "vendor-prebuilt.js")))
  ) {
    throw new Error(
      "stlite-cloudflare is missing its prebuilt runtime artifacts (runtime/ " +
        "and dist/). A published @stlite/cloudflare ships them; in the Stlite " +
        "monorepo, run `make cloudflare` first.",
    );
  }
  const frontendSrc = path.join(runtimeDir, "frontend");
  const wheelsDir = path.join(runtimeDir, "wheels");

  // Resolve the user's own dependencies for the Pyodide target and install them.
  await run("uv", ["run", "--project", ".", "pywrangler", "sync", "--force"], {
    cwd: projectDir,
  });

  // Vendor the Streamlit fork's prebuilt Pyodide dependency closure on top.
  const { vendorPrebuiltPackages } = await import("../dist/vendor-prebuilt.js");
  await vendorPrebuiltPackages({ packageDir, projectDir, cacheDir });

  // stlite has no working pyarrow (the runtime shims it); drop any that a user
  // dependency dragged in — ~100 MB of dead weight against the Worker size limit.
  await removeMatching(vendorDir, isPyarrowArtifact);

  // Replace whatever streamlit/stlite_lib pywrangler or the snapshot vendored
  // with our pinned fork wheels, and drop the app copy so it's refreshed below.
  await removeMatching(vendorDir, isRuntimeArtifact);
  await extractZip(
    await singleWheel(wheelsDir, /^stlite_lib-.*-py3-none-any\.whl$/),
    vendorDir,
  );
  await extractZip(
    await singleWheel(wheelsDir, /^streamlit-.*-py3-none-any\.whl$/),
    vendorDir,
  );
  await fs.cp(
    path.join(packageDir, "py", "stlite_cloudflare"),
    path.join(vendorDir, "stlite_cloudflare"),
    { recursive: true },
  );

  // The Worker serves the frontend from the vendored streamlit static dir;
  // overlay the Cloudflare build over whatever the wheel shipped.
  await mirrorDir(frontendSrc, path.join(vendorDir, "streamlit", "static"), {
    exclude: [".build-stamp"],
  });

  // Vendor the app, then write the package marker + entrypoint marker (after the
  // mirror, which would otherwise delete them).
  const appVendorDir = path.join(vendorDir, "_stlite_cloudflare_app");
  await mirrorDir(appDir, appVendorDir);
  await ensureFile(path.join(appVendorDir, "__init__.py"));
  await fs.writeFile(
    path.join(appVendorDir, "_stlite_entrypoint.py"),
    `ENTRYPOINT = ${JSON.stringify(entrypoint)}\n`,
  );
}

async function singleWheel(dir, pattern) {
  const matches = (await fs.readdir(dir))
    .filter((name) => pattern.test(name))
    .sort();
  if (matches.length === 0) {
    throw new Error(`No wheel matching ${pattern} in ${dir}`);
  }
  if (matches.length > 1) {
    throw new Error(
      `Multiple wheels match ${pattern} in ${dir} (${matches.join(", ")}); ` +
        "delete the stale ones and re-run the build.",
    );
  }
  return path.join(dir, matches[0]);
}

async function ensureFile(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "");
  }
}
