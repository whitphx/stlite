import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  consoleLogger,
  DEFAULT_PYODIDE_SOURCE,
  PrebuiltPackagesDataReader,
  vendorPrebuiltPackages,
} from "../../packages/app-packager/dist/index.js";

const execFileAsync = promisify(execFile);

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const cloudflareDir = path.resolve(scriptDir, "..");
const vendorDir = path.resolve(cloudflareDir, "python_modules");
const pyodidePackageDir = path.resolve(
  cloudflareDir,
  ".pyodide-prebuilt-packages",
);

const dependencies = ["fastparquet"];
const packagesToExtract = ["cramjam", "fastparquet", "fsspec"];
const prebuiltPackagesDataReader = new PrebuiltPackagesDataReader(
  DEFAULT_PYODIDE_SOURCE,
  consoleLogger,
);

await vendorPrebuiltPackages({
  destPyodideDir: pyodidePackageDir,
  dependencies,
  localWheelPaths: [],
  pyodideSource: DEFAULT_PYODIDE_SOURCE,
  logger: consoleLogger,
});

await removeExistingPackages();

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

async function removeExistingPackages() {
  const topLevelEntries = await fs.readdir(vendorDir);
  await Promise.all(
    topLevelEntries
      .filter((entryName) =>
        packagesToExtract.some(
          (packageName) =>
            entryName === packageName ||
            entryName.startsWith(`${packageName}-`),
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
