import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import {
  consoleLogger,
  DEFAULT_PYODIDE_SOURCE,
  PrebuiltPackagesDataReader,
  vendorPackageSnapshot,
} from "@stlite/app-packager";
import { extractTarGz, extractZip } from "./helpers/archive.mjs";
import {
  copyMissingPackages,
  entryMatchesPackage,
  findSitePackagesDir,
  hasPackageArtifact,
} from "./helpers/site-packages.mjs";

const execFileAsync = promisify(execFile);

// The stlite Worker runtime needs these on top of the Streamlit fork's declared
// dependencies, so they are vendored into every project's python_modules rather
// than being listed in the user's pyproject.toml: pyodide-http patches
// requests/urllib for Pyodide (stlite_lib.bootstrap), toml backs Streamlit's
// config/credentials loading (a soft `import toml`, not in its dependencies),
// and pydeck powers st.pydeck_chart. workers-runtime-sdk is not listed here
// because pywrangler always appends it during `pywrangler sync`.
const stliteRuntimeExtraDependencies = [
  "pyodide-http>=0.2.1",
  "toml>=0.10.1",
  "pydeck>=0.8.0b4,<1",
  // The Streamlit fork's regenerated proto code (protoc 7.x) raises a protobuf
  // VersionError when loaded against the protobuf 6.31.1 that Pyodide bundles.
  // Pinning a 7.x range makes the closure resolve the pure-Python wheel instead
  // of Pyodide's bundled 6.x, so the vendored runtime matches the gencode. The
  // browser worker does the same (packages/kernel/src/worker-runtime.ts).
  // See https://protobuf.dev/support/cross-version-runtime-guarantee
  "protobuf>=7.34.1,<8",
];
const buildOnlyPackages = new Set(["micropip"]);
const alwaysOverlayPrebuiltPackages = new Set(["cramjam", "fastparquet"]);

/**
 * Vendor the Streamlit fork's declared dependencies (plus the stlite runtime
 * extras) into `python_modules` for the Cloudflare Worker. Cross-platform: uses
 * @stlite/app-packager's Pyodide-in-Node snapshot and pure-Node archive
 * extraction (no system python3/tar).
 *
 * @param {object} opts
 * @param {string} opts.packageDir  The @stlite/cloudflare package root.
 * @param {string} opts.projectDir  The scaffolded output project (contains python_modules).
 * @param {string} opts.rootDir     The monorepo root (only used when reading deps from the submodule).
 * @param {string} opts.cacheDir    Reusable cache dir for the downloaded Pyodide wheels.
 */
export async function vendorPrebuiltPackages({
  packageDir,
  projectDir,
  rootDir,
  cacheDir,
}) {
  const vendorDir = path.resolve(projectDir, "python_modules");
  // The downloaded Pyodide wheels are an expensive, reusable cache, so they live
  // in cacheDir (outside the wiped-every-build projectDir).
  const pyodidePackageDir = path.resolve(
    cacheDir,
    ".pyodide-prebuilt-packages",
  );
  const snapshotPath = path.resolve(
    pyodidePackageDir,
    "site-packages-snapshot.tar.gz",
  );

  const prebuiltPackagesDataReader = new PrebuiltPackagesDataReader(
    DEFAULT_PYODIDE_SOURCE,
    consoleLogger,
  );

  const dependencies = [
    ...(await readStreamlitDependencies(packageDir, rootDir)),
    ...stliteRuntimeExtraDependencies,
  ];
  const usedPrebuiltPackages = await vendorPackageSnapshot({
    destPyodideDir: pyodidePackageDir,
    dependencies,
    localWheelPaths: [],
    pyodideSource: DEFAULT_PYODIDE_SOURCE,
    snapshotPath,
    logger: consoleLogger,
  });

  await overlayMissingSnapshotPackages(snapshotPath, vendorDir);

  const packagesToExtract = await getPrebuiltPackagesToExtract(
    usedPrebuiltPackages,
    vendorDir,
  );
  await removeExistingPackages(packagesToExtract, vendorDir);

  for (const packageName of packagesToExtract) {
    const packageInfo =
      await prebuiltPackagesDataReader.getPackageInfoByName(packageName);
    const wheelPath = path.resolve(pyodidePackageDir, packageInfo.file_name);
    try {
      await fs.access(wheelPath);
    } catch {
      throw new Error(`Missing Pyodide wheel for ${packageName}: ${wheelPath}`);
    }
    await extractZip(wheelPath, vendorDir);
  }
}

async function readStreamlitDependencies(packageDir, rootDir) {
  // The published package ships a snapshot of the Streamlit fork's declared
  // dependencies (produced at pack time); the monorepo reads them live from the
  // submodule's pyproject.toml (the only build-time system-Python use, and it
  // never runs on the published/end-user path).
  const bundledPath = path.resolve(
    packageDir,
    "runtime/streamlit-dependencies.json",
  );
  try {
    return JSON.parse(await fs.readFile(bundledPath, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  const streamlitPyprojectPath = path.resolve(
    rootDir,
    "streamlit/lib/pyproject.toml",
  );
  const { stdout } = await execFileAsync("python3", [
    "-c",
    [
      "import json, sys, tomllib",
      "from pathlib import Path",
      "data = tomllib.loads(Path(sys.argv[1]).read_text())",
      "print(json.dumps(data['project']['dependencies']))",
    ].join("\n"),
    streamlitPyprojectPath,
  ]);
  return JSON.parse(stdout);
}

async function overlayMissingSnapshotPackages(snapshotPath, vendorDir) {
  const snapshotDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "stlite-cloudflare-site-packages-"),
  );
  try {
    await extractTarGz(snapshotPath, snapshotDir);
    const sitePackagesDir = await findSitePackagesDir(snapshotDir);
    const copiedPackages = await copyMissingPackages(
      sitePackagesDir,
      vendorDir,
      [...buildOnlyPackages],
    );
    if (copiedPackages.length > 0) {
      consoleLogger.info(
        `Overlay pure-Python packages from Pyodide snapshot: ${JSON.stringify(copiedPackages)}`,
      );
    }
  } finally {
    await fs.rm(snapshotDir, { recursive: true, force: true });
  }
}

async function getPrebuiltPackagesToExtract(usedPrebuiltPackages, vendorDir) {
  const topLevelEntries = await fs.readdir(vendorDir);
  return usedPrebuiltPackages.filter(
    (packageName) =>
      !buildOnlyPackages.has(packageName) &&
      (alwaysOverlayPrebuiltPackages.has(packageName) ||
        !hasPackageArtifact(topLevelEntries, packageName)),
  );
}

async function removeExistingPackages(packageNames, vendorDir) {
  const topLevelEntries = await fs.readdir(vendorDir);
  await Promise.all(
    topLevelEntries
      .filter((entryName) =>
        packageNames.some((packageName) =>
          entryMatchesPackage(entryName, packageName),
        ),
      )
      .map((entryName) =>
        fs.rm(path.resolve(vendorDir, entryName), {
          recursive: true,
          force: true,
        }),
      ),
  );
}
