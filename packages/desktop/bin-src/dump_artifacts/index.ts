#!/usr/bin/env yarn ts-node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "node:path";
import fsPromises from "node:fs/promises";
import fsExtra from "fs-extra";
import { loadPyodide, type PyodideInterface } from "pyodide";
import { makePyodideUrl } from "./url";
import { PrebuiltPackagesData } from "./pyodide_packages";
import { dumpManifest } from "./manifest";
import { readConfig } from "./config";
import { validateRequirements, parseRequirementsTxt } from "@stlite/common";
import { glob } from "glob";
import { logger } from "./logger";

const pathFromScriptToBuild =
  process.env.PATH_FROM_SCRIPT_TO_BUILD ?? "../../build";
const pathFromScriptToWheels =
  process.env.PATH_FROM_SCRIPT_TO_WHEELS ?? "../../wheels";

/**
 * Ensure that the given package is loaded by throwing an error if any error occurs in the loadPackage() function.
 */
async function ensureLoadPackage(
  pyodide: PyodideInterface,
  packageName: string | string[]
) {
  const errorMessages: string[] = [];
  const errorCallback = (message: string): void => {
    errorMessages.push(message);
  };
  await pyodide.loadPackage(packageName, { errorCallback });
  if (errorMessages.length > 0) {
    throw new Error(errorMessages.join("\n"));
  }
}

interface CopyBuildDirectoryOptions {
  keepOld: boolean;
  copyTo: string;
}
async function copyBuildDirectory(options: CopyBuildDirectoryOptions) {
  logger.info(
    "Copy the build directory (the bare built app files) to this directory..."
  );

  const sourceDir = path.resolve(__dirname, pathFromScriptToBuild);
  const sourceDirStat = await fsPromises.stat(sourceDir);
  if (!sourceDirStat.isDirectory()) {
    throw new Error(`The source ${sourceDir} does not exist.`);
  }

  if (sourceDir === options.copyTo) {
    logger.warn(
      `sourceDir == destDir (${sourceDir}). Are you in the development environment? Skip copying the directory.`
    );
    return;
  }

  if (options.keepOld) {
    try {
      await fsPromises.access(options.copyTo);
      logger.info(`${options.copyTo} already exists. Use it and skip copying.`);
      return;
    } catch {
      // If the destination directory does not exist
      throw new Error(
        `${options.copyTo} does not exist even though the \`keepOld\` option is specified`
      );
    }
  }

  logger.debug(`Copy ${sourceDir} to ${options.copyTo}`);
  await fsPromises.rm(options.copyTo, { recursive: true, force: true });
  await fsExtra.copy(sourceDir, options.copyTo, { errorOnExist: true });
}

interface InspectUsedPrebuiltPackagesOptions {
  requirements: string[];
}
/**
 * Get the list of the prebuilt packages used by the given requirements.
 * These package files (`pyodide/*.whl`) will be vendored in the app executable
 * and loaded at runtime to avoid problems such as https://github.com/whitphx/stlite/issues/558
 */
async function inspectUsedPrebuiltPackages(
  options: InspectUsedPrebuiltPackagesOptions
): Promise<string[]> {
  if (options.requirements.length === 0) {
    return [];
  }

  const pyodide = await loadPyodide();

  await installPackages(pyodide, {
    requirements: options.requirements,
  });

  return Object.entries(pyodide.loadedPackages)
    .filter(([, channel]) => channel === "default channel")
    .map(([name]) => name);
}

async function prepareLocalWheel(
  pyodide: PyodideInterface,
  localPath: string
): Promise<string> {
  logger.debug(`Preparing the local wheel: %s`, localPath);

  const data = await fsPromises.readFile(localPath);
  const emfsPath = "/tmp/" + path.basename(localPath);
  pyodide.FS.writeFile(emfsPath, data);

  const requirement = `emfs:${emfsPath}`;
  logger.debug(`The local wheel %s is prepared as %s`, localPath, requirement);
  return requirement;
}

interface InstallStreamlitWheelsOptions {
  requirements: string[];
}
async function installPackages(
  pyodide: PyodideInterface,
  options: InstallStreamlitWheelsOptions
) {
  await ensureLoadPackage(pyodide, "micropip");
  const micropip = pyodide.pyimport("micropip");

  const requirements: string[] = [...options.requirements];

  const wheelsDir = path.join(__dirname, pathFromScriptToWheels);
  const stliteServerWheel = await prepareLocalWheel(
    pyodide,
    path.join(wheelsDir, "stlite_server-0.1.0-py3-none-any.whl")
  );
  requirements.push(stliteServerWheel);
  const streamlitWheel = await prepareLocalWheel(
    pyodide,
    path.join(wheelsDir, "streamlit-1.35.0-cp312-none-any.whl")
  );
  requirements.push(streamlitWheel);

  logger.info("Install the packages: %j", requirements);
  await micropip.install.callKwargs(requirements, { keep_going: true });
}

interface CreateSitePackagesSnapshotOptions {
  requirements: string[];
  usedPrebuiltPackages: string[];
  saveTo: string;
}
async function createSitePackagesSnapshot(
  options: CreateSitePackagesSnapshotOptions
) {
  logger.info("Create the site-packages snapshot file...");

  const pyodide = await loadPyodide();

  await ensureLoadPackage(pyodide, "micropip");
  const micropip = pyodide.pyimport("micropip");

  const prebuiltPackagesData = await PrebuiltPackagesData.getInstance();

  const mockedPackages: string[] = [];
  if (options.usedPrebuiltPackages.length > 0) {
    logger.info(
      "Mocking prebuilt packages so that they will not be included in the site-packages snapshot because these will be installed from the vendored wheel files at runtime..."
    );
    options.usedPrebuiltPackages.forEach((pkg) => {
      const packageInfo = prebuiltPackagesData.getPackageInfoByName(pkg);
      if (packageInfo == null) {
        throw new Error(`Package ${pkg} is not found in the lock file.`);
      }

      logger.debug(`Mock ${packageInfo.name} ${packageInfo.version}`);
      micropip.add_mock_package(packageInfo.name, packageInfo.version);
      mockedPackages.push(packageInfo.name);
    });
  }

  logger.info(`Install the requirements %j`, options.requirements);

  await installPackages(pyodide, {
    requirements: options.requirements,
  });

  logger.info("Remove the mocked packages: %j", mockedPackages);
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
  buildAppDirectory: string;
}

async function copyAppDirectory(options: CopyAppDirectoryOptions) {
  logger.info("Copy the app directory...");

  await Promise.all(
    options.filePathPatterns.map(async (pattern) => {
      const fileRelPaths = await glob(pattern, {
        cwd: options.cwd,
        absolute: false,
      });

      if (fileRelPaths.length === 0) {
        logger.warn(
          `No files match the pattern "${pattern}" in "${options.cwd}".`
        );
        return;
      }

      await Promise.all(
        fileRelPaths.map(async (relPath) => {
          const srcPath = path.resolve(options.cwd, relPath);
          const destPath = path.resolve(options.buildAppDirectory, relPath);
          logger.debug(`Copy ${srcPath} to ${destPath}`);
          await fsExtra.copy(srcPath, destPath, {
            errorOnExist: true,
          });
        })
      );
    })
  );
}

async function assertAppDirectoryContainsEntrypoint(
  appDirectory: string,
  entrypoint: string
) {
  try {
    await fsPromises.access(path.resolve(appDirectory, entrypoint));
  } catch {
    throw new Error(
      `The entrypoint file "${entrypoint}" is not included in the bundled files.`
    );
  }
}

async function readRequirements(
  requirementsTxtPath: string
): Promise<string[]> {
  const requirementsTxtData = await fsPromises.readFile(requirementsTxtPath, {
    encoding: "utf-8",
  });
  return parseRequirementsTxt(requirementsTxtData);
}

async function writePrebuiltPackagesTxt(
  prebuiltPackagesTxtPath: string,
  prebuiltPackages: string[]
): Promise<void> {
  const prebuiltPackagesTxtData = prebuiltPackages.join("\n");
  await fsPromises.writeFile(prebuiltPackagesTxtPath, prebuiltPackagesTxtData, {
    encoding: "utf-8",
  });
}

interface DownloadPrebuiltPackageWheelsOptions {
  packages: string[];
  destDir: string;
}
async function downloadPrebuiltPackageWheels(
  options: DownloadPrebuiltPackageWheelsOptions
) {
  const prebuiltPackagesData = await PrebuiltPackagesData.getInstance();
  const usedPrebuiltPackages = options.packages.map((pkgName) =>
    prebuiltPackagesData.getPackageInfoByName(pkgName)
  );
  const usedPrebuiltPackageUrls = usedPrebuiltPackages.map((pkg) =>
    makePyodideUrl(pkg.file_name)
  );

  logger.info("Downloading the used prebuilt packages...");
  await Promise.all(
    usedPrebuiltPackageUrls.map(async (pkgUrl) => {
      const dstPath = path.resolve(
        options.destDir,
        "./pyodide",
        path.basename(pkgUrl)
      );
      logger.debug(`Download ${pkgUrl} to ${dstPath}`);
      const res = await fetch(pkgUrl);
      if (!res.ok) {
        throw new Error(
          `Failed to download ${pkgUrl}: ${res.status} ${res.statusText}`
        );
      }
      const buf = await res.arrayBuffer();
      await fsPromises.writeFile(dstPath, Buffer.from(buf));
    })
  );
}

yargs(hideBin(process.argv))
  .command(
    "* [appHomeDirSource] [packages..]",
    "Put the user code and data and the snapshot of the required packages into the build artifact.",
    () => {}
  )
  .positional("appHomeDirSource", {
    describe:
      "[Deprecated] The source directory of the user code and data that will be mounted in the Pyodide file system at app runtime",
    type: "string",
    demandOption: false,
  })
  .positional("packages", {
    describe: "[Deprecated] Package names to install.",
    type: "string",
    array: true,
  })
  .options("project", {
    describe: "The project directory",
    type: "string",
    alias: "p",
    default: process.cwd(),
  })
  .options("requirement", {
    describe:
      "Install from the given requirements file. This option can be used multiple times.",
    array: true,
    type: "string",
    alias: "r",
    default: [],
    deprecated: true,
  })
  .options("keepOldBuild", {
    type: "boolean",
    default: false,
    alias: "k",
    describe: "Keep the existing build directory contents except appHomeDir.",
  })
  .options("logLevel", {
    type: "string",
    default: "info",
    describe: "The log level",
    choices: ["debug", "info", "warn", "error"],
  })
  .parseAsync()
  .then(async (args) => {
    logger.level = args.logLevel;

    logger.debug(`Command line arguments: %j`, args);

    const projectDir = args.project;
    const destDir = path.resolve(projectDir, "./build");

    const packageJsonPath = path.resolve(projectDir, "./package.json");
    const packageJson = require(packageJsonPath);

    const config = await readConfig({
      pathResolutionRoot: projectDir,
      packageJsonStliteDesktopField: packageJson.stlite?.desktop,
      fallbacks: {
        appHomeDirSource: args.appHomeDirSource,
        packages: args.packages,
        requirementsTxtFilePaths: args.requirement,
      },
    });
    logger.info(`File/directory patterns to be included: %j`, config.files);
    logger.info(`Entrypoint: %s`, config.entrypoint);
    logger.info(`Dependencies: %j`, config.dependencies);
    logger.info(
      `\`requirements.txt\` files: %j`,
      config.requirementsTxtFilePaths
    );

    const dependenciesFromRequirementsTxt = await Promise.all(
      config.requirementsTxtFilePaths.map(async (requirementsTxtPath) => {
        return readRequirements(requirementsTxtPath);
      })
    ).then((parsedRequirements) => parsedRequirements.flat());
    logger.info(
      "Dependencies from `requirements.txt` files: %j",
      dependenciesFromRequirementsTxt
    );

    const dependencies = validateRequirements([
      ...config.dependencies,
      ...dependenciesFromRequirementsTxt,
    ]);
    logger.info("Validated dependency list: %j", dependencies);

    const usedPrebuiltPackages = await inspectUsedPrebuiltPackages({
      requirements: dependencies,
    });
    logger.info(
      "The prebuilt packages loaded for the given requirements: %j",
      usedPrebuiltPackages
    );

    await copyBuildDirectory({ copyTo: destDir, keepOld: args.keepOldBuild });

    const buildAppDirectory = path.resolve(destDir, "./app_files"); // This path will be loaded in the `readStreamlitAppDirectory` handler in electron/main.ts.
    await copyAppDirectory({
      cwd: projectDir,
      filePathPatterns: config.files,
      buildAppDirectory,
    });
    assertAppDirectoryContainsEntrypoint(buildAppDirectory, config.entrypoint);

    await createSitePackagesSnapshot({
      requirements: dependencies,
      usedPrebuiltPackages,
      saveTo: path.resolve(destDir, "./site-packages-snapshot.tar.gz"), // This path will be loaded in the `readSitePackagesSnapshot` handler in electron/main.ts.
    });
    // These prebuilt packages will be vendored in the build artifact by `downloadPrebuiltPackageWheels()`
    // and the package names will be saved in the `./prebuilt-packages.txt` file
    // so that they will be read and passed to `pyodide.loadPackage()` at runtime to install them from the vendored files.
    // While the packages downloaded from PyPI at build time will have been shipped in the site-packages snapshot by `createSitePackagesSnapshot()`,
    // the prebuilt packages must be installed at runtime by `pyodide.loadPackage()` or `micropip.install()`
    // to avoid problems such as https://github.com/whitphx/stlite/issues/564.
    await writePrebuiltPackagesTxt(
      path.resolve(destDir, "./prebuilt-packages.txt"), // This path will be loaded in the `readRequirements` handler in electron/main.ts.
      usedPrebuiltPackages
    );
    await downloadPrebuiltPackageWheels({
      packages: usedPrebuiltPackages,
      destDir,
    });
    await dumpManifest({
      packageJsonStliteDesktopField: packageJson.stlite?.desktop,
      manifestFilePath: path.resolve(destDir, "./stlite-manifest.json"),
      fallbacks: {
        entrypoint: config.entrypoint, // Fallback to the `entrypoint` argument if the `stlite.desktop.entrypoint` field is not found in the `package.json`. This is for backward compatibility and will be deprecated in the future.
      },
    });
  });
