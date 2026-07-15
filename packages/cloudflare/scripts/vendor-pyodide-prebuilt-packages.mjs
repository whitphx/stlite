import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  consoleLogger,
  DEFAULT_PYODIDE_SOURCE,
  PrebuiltPackagesDataReader,
  vendorPackageSnapshot,
} from "../../app-packager/dist/index.js";

const execFileAsync = promisify(execFile);

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = process.env.STLITE_CLOUDFLARE_PACKAGE_DIR
  ? path.resolve(process.env.STLITE_CLOUDFLARE_PACKAGE_DIR)
  : path.resolve(scriptDir, "..");
const projectDir = process.env.STLITE_CLOUDFLARE_PROJECT_DIR
  ? path.resolve(process.env.STLITE_CLOUDFLARE_PROJECT_DIR)
  : packageDir;
const rootDir = process.env.STLITE_CLOUDFLARE_ROOT_DIR
  ? path.resolve(process.env.STLITE_CLOUDFLARE_ROOT_DIR)
  : path.resolve(packageDir, "../..");
// The downloaded Pyodide wheels are an expensive, reusable cache, so they live
// in CACHE_DIR (outside the wiped-every-build projectDir) when the converter
// provides one.
const cacheDir = process.env.STLITE_CLOUDFLARE_CACHE_DIR
  ? path.resolve(process.env.STLITE_CLOUDFLARE_CACHE_DIR)
  : projectDir;
const vendorDir = path.resolve(projectDir, "python_modules");
const pyodidePackageDir = path.resolve(cacheDir, ".pyodide-prebuilt-packages");
const snapshotPath = path.resolve(
  pyodidePackageDir,
  "site-packages-snapshot.tar.gz",
);

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
const prebuiltPackagesDataReader = new PrebuiltPackagesDataReader(
  DEFAULT_PYODIDE_SOURCE,
  consoleLogger,
);

const dependencies = [
  ...(await readStreamlitDependencies()),
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

await overlayMissingSnapshotPackages(snapshotPath);

const packagesToExtract =
  await getPrebuiltPackagesToExtract(usedPrebuiltPackages);
await removeExistingPackages(packagesToExtract);

for (const packageName of packagesToExtract) {
  const packageInfo =
    await prebuiltPackagesDataReader.getPackageInfoByName(packageName);
  const wheelPath = path.resolve(pyodidePackageDir, packageInfo.file_name);
  try {
    await fs.access(wheelPath);
  } catch {
    throw new Error(`Missing Pyodide wheel for ${packageName}: ${wheelPath}`);
  }

  await execFileAsync("python3", ["-m", "zipfile", "-e", wheelPath, vendorDir]);
}

async function readStreamlitDependencies() {
  // The published package ships a snapshot of the Streamlit fork's declared
  // dependencies (produced at pack time); the monorepo reads them live from the
  // submodule's pyproject.toml.
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

async function overlayMissingSnapshotPackages(packageSnapshotPath) {
  const snapshotDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "stlite-cloudflare-site-packages-"),
  );
  try {
    await execFileAsync("tar", [
      "-xzf",
      packageSnapshotPath,
      "-C",
      snapshotDir,
    ]);
    const sitePackagesDir = await findSitePackagesDir(snapshotDir);
    const { stdout } = await execFileAsync("python3", [
      "-c",
      getCopyMissingPackagesScript(),
      sitePackagesDir,
      vendorDir,
      JSON.stringify([...buildOnlyPackages]),
    ]);
    const copiedPackages = JSON.parse(stdout);
    if (copiedPackages.length > 0) {
      consoleLogger.info(
        `Overlay pure-Python packages from Pyodide snapshot: ${JSON.stringify(copiedPackages)}`,
      );
    }
  } finally {
    await fs.rm(snapshotDir, { recursive: true, force: true });
  }
}

async function findSitePackagesDir(root) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const entryPath = path.resolve(root, entry.name);
    if (entry.isDirectory() && entry.name === "site-packages") {
      return entryPath;
    }
    if (entry.isDirectory()) {
      try {
        return await findSitePackagesDir(entryPath);
      } catch (error) {
        if (!(error instanceof SitePackagesNotFoundError)) {
          throw error;
        }
      }
    }
  }
  throw new SitePackagesNotFoundError(root);
}

class SitePackagesNotFoundError extends Error {}

async function getPrebuiltPackagesToExtract(usedPrebuiltPackages) {
  const topLevelEntries = await fs.readdir(vendorDir);
  return usedPrebuiltPackages.filter(
    (packageName) =>
      !buildOnlyPackages.has(packageName) &&
      (alwaysOverlayPrebuiltPackages.has(packageName) ||
        !hasPackageArtifact(topLevelEntries, packageName)),
  );
}

async function removeExistingPackages(packageNames) {
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

function hasPackageArtifact(topLevelEntries, packageName) {
  return topLevelEntries.some((entryName) =>
    entryMatchesPackage(entryName, packageName),
  );
}

function entryMatchesPackage(entryName, packageName) {
  const normalizedPackageName = normalizePackageName(packageName);
  const normalizedEntryName = normalizePackageName(
    entryName.replace(/\.(dist-info|egg-info)$/, "").replace(/\.py$/, ""),
  );
  if (normalizedEntryName === normalizedPackageName) {
    return true;
  }
  // "<name>-<version>" artifacts such as dist-info dirs; requiring a digit
  // right after the dash keeps e.g. "pytest" from matching "pytest-asyncio".
  return (
    normalizedEntryName.startsWith(`${normalizedPackageName}-`) &&
    /^\d/.test(normalizedEntryName.slice(normalizedPackageName.length + 1))
  );
}

function normalizePackageName(packageName) {
  return packageName.toLowerCase().replace(/[-_.]+/g, "-");
}

function getCopyMissingPackagesScript() {
  return String.raw`
import csv
import json
import re
import shutil
import sys
from email.parser import Parser
from pathlib import Path

site_packages = Path(sys.argv[1]).resolve()
vendor_dir = Path(sys.argv[2]).resolve()

def normalize_name(name):
    return re.sub(r"[-_.]+", "-", name).lower()

skip_packages = {normalize_name(name) for name in json.loads(sys.argv[3])}

def entry_matches_package(entry_name, package_name):
    normalized_package_name = normalize_name(package_name)
    stripped_name = (
        entry_name.removesuffix(".dist-info")
        .removesuffix(".egg-info")
        .removesuffix(".py")
    )
    normalized_entry_name = normalize_name(stripped_name)
    if normalized_entry_name == normalized_package_name:
        return True
    # "<name>-<version>" artifacts such as dist-info dirs; requiring a digit
    # right after the dash keeps e.g. "pytest" from matching "pytest-asyncio".
    version_part = normalized_entry_name.removeprefix(normalized_package_name + "-")
    return version_part != normalized_entry_name and version_part[:1].isdigit()

def has_package_artifact(package_name):
    return any(
        entry_matches_package(entry.name, package_name)
        for entry in vendor_dir.iterdir()
    )

copied_packages = []
for dist_info_dir in site_packages.glob("*.dist-info"):
    metadata_path = dist_info_dir / "METADATA"
    if not metadata_path.exists():
        continue

    metadata = Parser().parsestr(metadata_path.read_text())
    package_name = metadata.get("Name")
    if package_name is None:
        continue

    if normalize_name(package_name) in skip_packages or has_package_artifact(package_name):
        continue

    record_path = dist_info_dir / "RECORD"
    if not record_path.exists():
        continue

    with record_path.open(newline="") as record_file:
        for row in csv.reader(record_file):
            if not row:
                continue

            source_path = (site_packages / row[0]).resolve()
            try:
                relative_path = source_path.relative_to(site_packages)
            except ValueError:
                continue
            if not source_path.is_file():
                continue

            destination_path = vendor_dir / relative_path
            destination_path.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source_path, destination_path)

    copied_packages.append(package_name)

print(json.dumps(copied_packages))
`;
}
