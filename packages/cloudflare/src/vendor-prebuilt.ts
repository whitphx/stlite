import path from "node:path";
import {
  consoleLogger,
  DEFAULT_PYODIDE_SOURCE,
  PrebuiltPackagesDataReader,
  vendorPackageSnapshot,
} from "@stlite/app-packager";
import { singleWheel } from "./helpers/fsx.ts";
import {
  outputVendorPythonModules,
  runVendorPythonModules,
} from "./helpers/python.ts";

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

export interface VendorPrebuiltPackagesOptions {
  /** The @stlite/cloudflare package root. */
  packageDir: string;
  /** The scaffolded output project (contains python_modules). */
  projectDir: string;
  /** Reusable cache dir for the downloaded Pyodide wheels. */
  cacheDir: string;
}

/**
 * Vendor the Streamlit fork's declared dependencies (plus the stlite runtime
 * extras) into `python_modules` for the Cloudflare Worker. Node drives
 * @stlite/app-packager's Pyodide-in-Node snapshot (the wheel resolver and
 * downloader); the dist-info-aware copy/extract work runs in the output
 * project's venv (py/vendor_python_modules.py).
 */
export async function vendorPrebuiltPackages({
  packageDir,
  projectDir,
  cacheDir,
}: VendorPrebuiltPackagesOptions): Promise<void> {
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
    ...(await readStreamlitDependencies(packageDir, projectDir)),
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

  const wheelArgs: string[] = [];
  for (const packageName of usedPrebuiltPackages) {
    const packageInfo =
      await prebuiltPackagesDataReader.getPackageInfoByName(packageName);
    const wheelPath = path.resolve(pyodidePackageDir, packageInfo.file_name);
    wheelArgs.push("--wheel", `${packageName}=${wheelPath}`);
  }
  await runVendorPythonModules(packageDir, projectDir, [
    "vendor-prebuilt",
    "--vendor-dir",
    path.resolve(projectDir, "python_modules"),
    "--snapshot",
    snapshotPath,
    ...wheelArgs,
  ]);
}

async function readStreamlitDependencies(
  packageDir: string,
  projectDir: string,
): Promise<string[]> {
  // The shipped streamlit wheel's own METADATA is the source of truth for the
  // fork's dependency list; read its core Requires-Dist entries instead of
  // maintaining a parallel snapshot artifact that could drift.
  const wheelPath = await singleWheel(
    path.join(packageDir, "runtime", "wheels"),
    /^streamlit-.*-py3-none-any\.whl$/,
  );
  const stdout = await outputVendorPythonModules(packageDir, projectDir, [
    "wheel-requires",
    "--wheel",
    wheelPath,
  ]);
  return stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
