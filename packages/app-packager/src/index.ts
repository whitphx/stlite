import path from "node:path";
import fsPromises from "node:fs/promises";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import fsExtra from "fs-extra";
import {
  loadPyodide,
  version as pyodideVersion,
  type PyodideInterface,
} from "pyodide";
import { glob } from "glob";
import { parseRequirementsTxt } from "@stlite/common";
import { PrebuiltPackagesDataReader } from "./pyodide-packages.js";
import { consoleLogger, type Logger } from "./logger.js";

export { type Logger, consoleLogger } from "./logger.js";
export { PrebuiltPackagesDataReader } from "./pyodide-packages.js";

export const DEFAULT_PYODIDE_SOURCE = `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`;

/**
 * The Pyodide runtime files copied into a packaged artifact's `pyodide/` dir
 * so the resulting web app boots offline. These are the same files that
 * Pyodide's `pyodide-core` release tarball ships under `pyodide/`.
 */
const PYODIDE_RUNTIME_FILES = [
  "pyodide.asm.js",
  "pyodide.asm.wasm",
  "pyodide.mjs",
  "python_stdlib.zip",
  "pyodide-lock.json",
] as const;

const localRequire = createRequire(import.meta.url);

/**
 * Copies Pyodide's runtime files (`pyodide.mjs`, `pyodide.asm.{js,wasm}`,
 * `python_stdlib.zip`, `pyodide-lock.json`) from the installed `pyodide` npm
 * package into `<destPyodideDir>`. The packaged HTML loads them via
 * `pyodideUrl: "./pyodide/pyodide.mjs"` so the artifact runs without
 * fetching from a CDN.
 */
export async function copyPyodideRuntime(
  destPyodideDir: string,
): Promise<void> {
  const pyodidePkgDir = path.dirname(
    localRequire.resolve("pyodide/package.json"),
  );
  await fsPromises.mkdir(destPyodideDir, { recursive: true });
  for (const fileName of PYODIDE_RUNTIME_FILES) {
    await fsPromises.copyFile(
      path.join(pyodidePkgDir, fileName),
      path.join(destPyodideDir, fileName),
    );
  }
}

export interface PackageAppOptions {
  /** The destination directory the artifacts get written into. Caller is responsible for creating it and copying any host-specific shell (SPA, manifest, etc.) before/after this call. */
  destDir: string;
  /** Project source directory (cwd for the file glob patterns). */
  sourceDir: string;
  /** Glob patterns relative to sourceDir for files to copy into `<destDir>/app_files/`. */
  files: string[];
  /** Entrypoint path relative to sourceDir; validated to exist after copying. */
  entrypoint: string;
  /** Python deps to install via micropip. */
  dependencies: string[];
  /** Local wheel files (e.g. stlite_lib, streamlit) installed in addition to `dependencies`. */
  localWheelPaths: string[];
  /**
   * When true, the local wheels are installed only for prebuilt-package
   * discovery (so their transitive prebuilt deps get vendored into pyodide/
   * and listed in prebuilt-packages.txt) but their files are NOT included
   * in the site-packages snapshot. Defaults to false. Use this when the
   * runtime will install these wheels itself (e.g. @stlite/browser's
   * default wheelUrls install stlite_lib + streamlit at boot).
   */
  excludeLocalWheelsFromSnapshot?: boolean;
  /** CDN URL or local path to Pyodide files (pyodide-lock.json, prebuilt wheels). */
  pyodideSource?: string;
  /** Optional logger; defaults to console. */
  logger?: Logger;
}

/**
 * Vendors a Streamlit project's Python dependencies into a destDir using
 * Pyodide-in-Node, copies the user's app files, and writes the
 * `prebuilt-packages.txt` manifest.
 *
 * Adds the following under `destDir`:
 * - `app_files/`            user code (matched by `files` glob patterns)
 * - `pyodide/`              vendored prebuilt wheels (Pyodide's package cache)
 * - `site-packages-snapshot.tar.gz`  pure-Python deps
 * - `prebuilt-packages.txt` names the runtime should `loadPackage()` at boot
 *
 * Does NOT touch the SPA bundle or any host-specific manifest — those are
 * the caller's responsibility (so the same primitive serves both `stlite
 * web`'s minimal HTML shell and `stlite desktop`'s Electron-tuned SPA).
 */
export async function packageApp(opts: PackageAppOptions): Promise<void> {
  const logger = opts.logger ?? consoleLogger;
  const pyodideSource = normalizePyodideSource(
    opts.pyodideSource ?? DEFAULT_PYODIDE_SOURCE,
  );
  const pyodideRuntimeDir = path.resolve(opts.destDir, "./pyodide");
  const destAppDir = path.resolve(opts.destDir, "./app_files");

  await fsPromises.mkdir(opts.destDir, { recursive: true });

  const usedPrebuiltPackages = await saveUsedPrebuiltPackages({
    pyodideSource,
    pyodideRuntimeDir,
    requirements: opts.dependencies,
    localWheelPaths: opts.localWheelPaths,
    logger,
  });
  logger.info(
    `Prebuilt packages loaded for the requirements: ${JSON.stringify(usedPrebuiltPackages)}`,
  );

  await copyAppDirectory({
    cwd: opts.sourceDir,
    filePathPatterns: opts.files,
    destAppDir,
    logger,
  });
  await assertAppDirContainsEntrypoint(destAppDir, opts.entrypoint);

  await createSitePackagesSnapshot({
    requirements: opts.dependencies,
    localWheelPaths: opts.excludeLocalWheelsFromSnapshot
      ? []
      : opts.localWheelPaths,
    usedPrebuiltPackages,
    pyodideSource,
    pyodideRuntimeDir,
    saveTo: path.resolve(opts.destDir, "./site-packages-snapshot.tar.gz"),
    logger,
  });

  await writePrebuiltPackagesTxt(
    path.resolve(opts.destDir, "./prebuilt-packages.txt"),
    usedPrebuiltPackages,
  );
}

export function normalizePyodideSource(urlOrPath: string): string {
  return urlOrPath.endsWith("/") ? urlOrPath : urlOrPath + "/";
}

export async function readRequirementsTxt(
  requirementsTxtPath: string,
): Promise<string[]> {
  const requirementsTxtData = await fsPromises.readFile(requirementsTxtPath, {
    encoding: "utf-8",
  });
  return parseRequirementsTxt(requirementsTxtData);
}

interface SaveUsedPrebuiltPackagesOptions {
  pyodideSource: string;
  pyodideRuntimeDir: string;
  requirements: string[];
  localWheelPaths: string[];
  logger: Logger;
}
/**
 * Loads Pyodide-in-Node with `packageCacheDir` pointed at `pyodideRuntimeDir`,
 * installs the given requirements (so any prebuilt packages they pull in get
 * vendored to disk), and returns the names of the prebuilt packages that were
 * resolved from Pyodide's "default channel". The runtime reads the resulting
 * prebuilt-packages.txt and re-installs them from the vendored files.
 */
async function saveUsedPrebuiltPackages(
  options: SaveUsedPrebuiltPackagesOptions,
): Promise<string[]> {
  if (
    options.requirements.length === 0 &&
    options.localWheelPaths.length === 0
  ) {
    return [];
  }

  const pyodide = await loadPyodide({
    packageBaseUrl: options.pyodideSource,
    packageCacheDir: options.pyodideRuntimeDir,
  });

  await installPackages(pyodide, {
    requirements: options.requirements,
    localWheelPaths: options.localWheelPaths,
    logger: options.logger,
  });

  return Object.entries(pyodide.loadedPackages)
    .filter(([, channel]) => channel === "default channel")
    .map(([name]) => name);
}

interface InstallPackagesOptions {
  requirements: string[];
  localWheelPaths: string[];
  logger: Logger;
}
async function installPackages(
  pyodide: PyodideInterface,
  options: InstallPackagesOptions,
) {
  await ensureLoadPackage(pyodide, "micropip");
  const micropip = pyodide.pyimport("micropip");

  const requirements: string[] = [...options.requirements];
  for (const wheelPath of options.localWheelPaths) {
    const requirement = await prepareLocalWheel(
      pyodide,
      wheelPath,
      options.logger,
    );
    requirements.push(requirement);
  }

  options.logger.info(`Install the packages: ${JSON.stringify(requirements)}`);
  await micropip.install.callKwargs(requirements, { keep_going: true });
}

async function prepareLocalWheel(
  pyodide: PyodideInterface,
  localPath: string,
  logger: Logger,
): Promise<string> {
  logger.debug(`Preparing the local wheel: ${localPath}`);
  const data = await fsPromises.readFile(localPath);
  // Stage in a path-derived sub-directory so wheels with the same basename
  // (e.g. two `streamlit-1.x.y-cp313-none-any.whl` from different vendors)
  // don't overwrite each other. The basename itself must stay unchanged
  // because micropip parses it as a PEP 427 wheel filename to derive the
  // package name + version.
  const hash = createHash("sha1").update(localPath).digest("hex").slice(0, 8);
  const emfsDir = `/tmp/wheels-${hash}`;
  pyodide.FS.mkdirTree(emfsDir);
  const emfsPath = `${emfsDir}/${path.basename(localPath)}`;
  pyodide.FS.writeFile(emfsPath, data);
  const requirement = `emfs:${emfsPath}`;
  logger.debug(`The local wheel ${localPath} is prepared as ${requirement}`);
  return requirement;
}

interface CreateSitePackagesSnapshotOptions {
  requirements: string[];
  localWheelPaths: string[];
  usedPrebuiltPackages: string[];
  pyodideRuntimeDir: string;
  pyodideSource: string;
  saveTo: string;
  logger: Logger;
}
async function createSitePackagesSnapshot(
  options: CreateSitePackagesSnapshotOptions,
) {
  const { logger } = options;
  logger.info("Create the site-packages snapshot file...");

  // TODO: this is the second `loadPyodide()` call in `packageApp` — the first
  // happens in `saveUsedPrebuiltPackages` to discover which prebuilt packages
  // get pulled in. Two interpreter starts cost several seconds. They are
  // intentionally separate today because the snapshot pass needs to install
  // *with* prebuilts mocked out (so their files don't end up in the tarball),
  // while the discovery pass needs them un-mocked. Folding them into one
  // would require either rewinding micropip state or threading a "mock these
  // after the fact" flag through micropip — neither is cheap. Revisit if
  // start-up time becomes the dominant CLI runtime.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pyodide: PyodideInterface & { FS: any } = await loadPyodide({
    packageBaseUrl: options.pyodideSource,
    packageCacheDir: options.pyodideRuntimeDir,
  });

  await ensureLoadPackage(pyodide, "micropip");
  const micropip = pyodide.pyimport("micropip");

  const prebuiltPackagesDataReader = new PrebuiltPackagesDataReader(
    options.pyodideSource,
    logger,
  );

  const mockedPackages: string[] = [];
  if (options.usedPrebuiltPackages.length > 0) {
    logger.info(
      "Mocking prebuilt packages so that they will not be included in the site-packages snapshot — they get installed from the vendored wheel files at runtime instead.",
    );
    for (const pkg of options.usedPrebuiltPackages) {
      const packageInfo =
        await prebuiltPackagesDataReader.getPackageInfoByName(pkg);
      if (packageInfo == null) {
        throw new Error(`Package ${pkg} is not found in the lock file.`);
      }
      logger.debug(`Mock ${packageInfo.name} ${packageInfo.version}`);
      micropip.add_mock_package(packageInfo.name, packageInfo.version);
      mockedPackages.push(packageInfo.name);
    }
  }

  logger.info(
    `Install the requirements ${JSON.stringify(options.requirements)}`,
  );
  await installPackages(pyodide, {
    requirements: options.requirements,
    localWheelPaths: options.localWheelPaths,
    logger,
  });

  logger.info(`Remove the mocked packages: ${JSON.stringify(mockedPackages)}`);
  mockedPackages.forEach((pkg) => micropip.remove_mock_package(pkg));

  logger.info("Archive the site-packages director(y|ies)");
  const archiveFilePath = "/tmp/site-packages-snapshot.tar.gz";
  await pyodide.runPythonAsync(`
    import os
    import tarfile
    import site

    site_packages_dirs = site.getsitepackages()

    tar_file_name = '${archiveFilePath}'
    with tarfile.open(tar_file_name, mode='w:gz') as gzf:
        for site_packages in site_packages_dirs:
            print("Add site-package:", site_packages)
            print(os.listdir(site_packages))
            gzf.add(site_packages)
  `);

  logger.info("Extract the archive file from EMFS");
  const archiveBin = pyodide.FS.readFile(archiveFilePath);

  logger.info(`Save the archive file (${options.saveTo})`);
  await fsPromises.writeFile(options.saveTo, archiveBin);
}

interface CopyAppDirectoryOptions {
  cwd: string;
  filePathPatterns: string[];
  destAppDir: string;
  logger: Logger;
}
async function copyAppDirectory(options: CopyAppDirectoryOptions) {
  options.logger.info("Copy the app directory...");
  await Promise.all(
    options.filePathPatterns.map(async (pattern) => {
      const fileRelPaths = await glob(pattern, {
        cwd: options.cwd,
        absolute: false,
      });
      if (fileRelPaths.length === 0) {
        options.logger.warn(
          `No files match the pattern "${pattern}" in "${options.cwd}".`,
        );
        return;
      }
      await Promise.all(
        fileRelPaths.map(async (relPath) => {
          // Reject paths that would escape destAppDir via `..` segments or
          // an absolute glob result — defends the destination tree against
          // crafted input directories.
          const normalized = path.normalize(relPath);
          if (
            path.isAbsolute(normalized) ||
            normalized === ".." ||
            normalized.startsWith(".." + path.sep)
          ) {
            options.logger.warn(
              `Skipping ${relPath} from "${options.cwd}" — path escapes destination.`,
            );
            return;
          }
          const srcPath = path.resolve(options.cwd, normalized);
          const destPath = path.resolve(options.destAppDir, normalized);
          options.logger.debug(`Copy ${srcPath} to ${destPath}`);
          await fsExtra.copy(srcPath, destPath, { errorOnExist: true });
        }),
      );
    }),
  );
}

async function assertAppDirContainsEntrypoint(
  appDir: string,
  entrypoint: string,
) {
  try {
    await fsPromises.access(path.resolve(appDir, entrypoint));
  } catch {
    throw new Error(
      `The entrypoint file "${entrypoint}" is not included in the bundled files.`,
    );
  }
}

async function writePrebuiltPackagesTxt(
  prebuiltPackagesTxtPath: string,
  prebuiltPackages: string[],
): Promise<void> {
  await fsPromises.writeFile(
    prebuiltPackagesTxtPath,
    prebuiltPackages.join("\n"),
    { encoding: "utf-8" },
  );
}

async function ensureLoadPackage(
  pyodide: PyodideInterface,
  packageName: string | string[],
) {
  const errorMessages: string[] = [];
  await pyodide.loadPackage(packageName, {
    errorCallback: (m) => errorMessages.push(m),
  });
  if (errorMessages.length > 0) {
    throw new Error(errorMessages.join("\n"));
  }
}
