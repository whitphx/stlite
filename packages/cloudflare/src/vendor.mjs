import { execFile } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { promisify } from "node:util";
import { extractZip } from "./helpers/archive.mjs";
import { mirrorDir, removeMatching } from "./helpers/fsx.mjs";
import { run } from "./helpers/spawn.mjs";

const execFileAsync = promisify(execFile);

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
 * Worker directory. The Node port of sync-workers-vendor.sh: cross-platform, the
 * only external process on the published (bundled) path is `uv`/`pywrangler`.
 * Monorepo (source-tree) builds additionally spawn `make`/`corepack yarn`/`git`
 * to build the wheels + frontend, which are POSIX/dev tools.
 *
 * @param {object} opts
 * @param {string} opts.packageDir  The @stlite/cloudflare package root.
 * @param {string} opts.projectDir  The scaffolded output project (gets python_modules).
 * @param {string} opts.appDir      The user's Streamlit project directory.
 * @param {string} opts.cacheDir    Reusable cache dir (frontend build, Pyodide wheels).
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

  // The frontend build below runs outside make; give child Node processes the
  // heap headroom the root Makefile exports for its own targets.
  if (!process.env.NODE_OPTIONS) {
    process.env.NODE_OPTIONS = "--max-old-space-size=6144";
  }

  // A published @stlite/cloudflare ships prebuilt runtime artifacts (runtime/ +
  // the dist/ vendoring bundle) and builds without the monorepo; from the source
  // tree those are absent and we build them.
  const bundled =
    (await exists(path.join(packageDir, "runtime", "frontend"))) &&
    (await exists(path.join(packageDir, "dist", "vendor-prebuilt.js")));

  let frontendSrc;
  let stliteLibWheelDir;
  let streamlitWheelDir;
  let rootDir;

  if (!bundled) {
    rootDir = process.env.STLITE_CLOUDFLARE_ROOT_DIR
      ? path.resolve(process.env.STLITE_CLOUDFLARE_ROOT_DIR)
      : path.resolve(packageDir, "..", "..");
    if (
      !(await exists(path.join(rootDir, "streamlit"))) ||
      !(await exists(path.join(rootDir, "packages/kernel/py/stlite-lib")))
    ) {
      throw new Error(
        "stlite-cloudflare cannot find the runtime artifacts. A published " +
          "@stlite/cloudflare ships them (runtime/, dist/); otherwise this build " +
          "reads them from the Stlite monorepo source tree, which was not found " +
          "either. On Windows, build from source under WSL — the published " +
          "package builds natively.",
      );
    }
    frontendSrc = await buildMonorepoFrontend({
      packageDir,
      rootDir,
      cacheDir,
    });
    await run("make", ["-C", rootDir, "stlite-lib-wheel", "streamlit-wheel"]);
    await run(
      "corepack",
      ["yarn", "workspace", "@stlite/app-packager", "build"],
      {
        cwd: rootDir,
      },
    );
    stliteLibWheelDir = path.join(
      rootDir,
      "packages/kernel/py/stlite-lib/dist",
    );
    streamlitWheelDir = path.join(rootDir, "streamlit/lib/dist");
  } else {
    frontendSrc = path.join(packageDir, "runtime", "frontend");
    stliteLibWheelDir = path.join(packageDir, "runtime", "wheels");
    streamlitWheelDir = path.join(packageDir, "runtime", "wheels");
  }

  // Resolve the user's own dependencies for the Pyodide target and install them.
  await run("uv", ["run", "--project", ".", "pywrangler", "sync", "--force"], {
    cwd: projectDir,
  });

  // Vendor the Streamlit fork's prebuilt Pyodide dependency closure on top.
  const { vendorPrebuiltPackages } = await import(
    bundled ? "../dist/vendor-prebuilt.js" : "./vendor-prebuilt.mjs"
  );
  await vendorPrebuiltPackages({ packageDir, projectDir, rootDir, cacheDir });

  // stlite has no working pyarrow (the runtime shims it); drop any that a user
  // dependency dragged in — ~100 MB of dead weight against the Worker size limit.
  await removeMatching(vendorDir, isPyarrowArtifact);

  // Replace whatever streamlit/stlite_lib pywrangler or the snapshot vendored
  // with our pinned fork wheels, and drop the app copy so it's refreshed below.
  await removeMatching(vendorDir, isRuntimeArtifact);
  await extractZip(
    await singleWheel(stliteLibWheelDir, /^stlite_lib-.*-py3-none-any\.whl$/),
    vendorDir,
  );
  await extractZip(
    await singleWheel(streamlitWheelDir, /^streamlit-.*-py3-none-any\.whl$/),
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

async function buildMonorepoFrontend({ packageDir, rootDir, cacheDir }) {
  // The Cloudflare-variant frontend is kept per-project instead of being synced
  // into the shared streamlit submodule (make streamlit-wheel doesn't track
  // static assets, so a submodule-side copy could go missing from an
  // already-built wheel and would leak into other packages' wheels).
  //
  // The stamp tracks the submodule HEAD and this package's frontend sources;
  // uncommitted edits inside the submodule are not detected — delete the build
  // dir to force a rebuild in that case.
  const streamlitFrontendDir = path.join(rootDir, "streamlit", "frontend");
  const frontendBuildDir = path.join(
    cacheDir,
    ".stlite-cloudflare-remote-frontend",
  );
  const stampFile = path.join(frontendBuildDir, ".build-stamp");
  const stamp = await computeFrontendStamp(rootDir, packageDir);

  const current = await fs.readFile(stampFile, "utf8").catch(() => null);
  if (current?.trimEnd() !== stamp) {
    await run(
      "corepack",
      [
        "yarn",
        "workspaces",
        "foreach",
        "--recursive",
        "--topological",
        "--parallel",
        "--from",
        "@streamlit/app",
        "--exclude",
        "@streamlit/app",
        "--exclude",
        "@streamlit/lib",
        "run",
        "build",
      ],
      { cwd: streamlitFrontendDir },
    );
    await run(
      "corepack",
      ["yarn", "node", path.join(packageDir, "frontend", "build.mjs")],
      { cwd: streamlitFrontendDir },
    );
    await mirrorDir(
      path.join(streamlitFrontendDir, "app", "build"),
      frontendBuildDir,
      { exclude: ["reports"] },
    );
    await fs.writeFile(stampFile, `${stamp}\n`);
  }
  return frontendBuildDir;
}

async function computeFrontendStamp(rootDir, packageDir) {
  let head = "unknown";
  try {
    const { stdout } = await execFileAsync("git", [
      "-C",
      path.join(rootDir, "streamlit"),
      "rev-parse",
      "HEAD",
    ]);
    head = stdout.trim();
  } catch {
    // Not a git checkout (e.g. a tarball); the source-hash below still changes
    // the stamp when the frontend sources change.
  }
  const frontendDir = path.join(packageDir, "frontend");
  const hash = crypto.createHash("sha256");
  for (const name of (await fs.readdir(frontendDir)).sort()) {
    const filePath = path.join(frontendDir, name);
    if ((await fs.stat(filePath)).isFile()) {
      hash.update(await fs.readFile(filePath));
    }
  }
  return `${head}-${hash.digest("hex")}`;
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

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}
