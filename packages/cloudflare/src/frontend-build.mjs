import { execFile } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { mirrorDir } from "./helpers/fsx.mjs";
import { run } from "./helpers/spawn.mjs";

const execFileAsync = promisify(execFile);

/**
 * Build the Cloudflare-variant Streamlit frontend from the monorepo source tree
 * and return the directory holding it. Shared by the monorepo vendoring path
 * (vendor.mjs) and the runtime-artifact packer (scripts/build-runtime.mjs).
 *
 * The build is cached by a stamp under the output dir, so repeated calls with an
 * unchanged submodule + frontend sources are near-free.
 *
 * @param {object} opts
 * @param {string} opts.packageDir  The @stlite/cloudflare package root.
 * @param {string} opts.rootDir     The Stlite monorepo root (holds streamlit/).
 * @param {string} opts.cacheDir    Reusable dir the built frontend is placed under.
 * @returns {Promise<string>} Path to the built frontend directory.
 */
export async function buildMonorepoFrontend({ packageDir, rootDir, cacheDir }) {
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
