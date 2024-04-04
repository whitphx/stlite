#!/usr/bin/env yarn ts-node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import fsPromises from "fs/promises";
import fsExtra from "fs-extra";
import fetch from "node-fetch";
import { loadPyodide, type PyodideInterface } from "pyodide";
import { parseRequirementsTxt, validateRequirements } from "@stlite/common";
import { makePyodideUrl } from "./url";
import { PrebuiltPackagesData } from "./pyodide_packages";
import { dumpManifest } from "./manifest";

// @ts-ignore
global.fetch = fetch; // The global `fetch()` is necessary for micropip.install() to load the remote packages.

const pathFromScriptToBuild =
  process.env.PATH_FROM_SCRIPT_TO_BUILD ?? "../../build";
const pathFromScriptToWheels =
  process.env.PATH_FROM_SCRIPT_TO_WHEELS ?? "../../wheels";

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
  console.info(
    "Copy the build directory (the bare built app files) to this directory..."
  );

  const sourceDir = path.resolve(__dirname, pathFromScriptToBuild);
  const sourceDirStat = await fsPromises.stat(sourceDir);
  if (!sourceDirStat.isDirectory()) {
    throw new Error(`The source ${sourceDir} does not exist.`);
  }

  if (sourceDir === options.copyTo) {
    console.warn(
      `sourceDir == destDir (${sourceDir}). Are you in the development environment? Skip copying the directory.`
    );
    return;
  }

  if (options.keepOld) {
    try {
      await fsPromises.access(options.copyTo);
      console.info(
        `${options.copyTo} already exists. Use it and skip copying.`
      );
      return;
    } catch {
      // If the destination directory does not exist
      throw new Error(
        `${options.copyTo} does not exist even though the \`keepOld\` option is specified`
      );
    }
  }

  console.log(`Copy ${sourceDir} to ${options.copyTo}`);
  await fsPromises.rm(options.copyTo, { recursive: true, force: true });
  await fsExtra.copy(sourceDir, options.copyTo);
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
  console.log(`Preparing the local wheel ${localPath}`);

  const data = await fsPromises.readFile(localPath);
  const emfsPath = "/tmp/" + path.basename(localPath);
  pyodide.FS.writeFile(emfsPath, data);

  const requirement = `emfs:${emfsPath}`;
  console.log(`The local wheel ${localPath} is prepared as ${requirement}`);
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
    path.join(wheelsDir, "streamlit-1.32.2-cp311-none-any.whl")
  );
  requirements.push(streamlitWheel);

  console.log("Install the packages:", requirements);
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
  console.info("Create the site-packages snapshot file...");

  const pyodide = await loadPyodide();

  await ensureLoadPackage(pyodide, "micropip");
  const micropip = pyodide.pyimport("micropip");

  const prebuiltPackagesData = await PrebuiltPackagesData.getInstance();

  const mockedPackages: string[] = [];
  if (options.usedPrebuiltPackages.length > 0) {
    console.log(
      "Mocking prebuilt packages so that they will not be included in the site-packages snapshot because these will be installed from the vendored wheel files at runtime..."
    );
    options.usedPrebuiltPackages.forEach((pkg) => {
      const packageInfo = prebuiltPackagesData.getPackageInfoByName(pkg);
      if (packageInfo == null) {
        throw new Error(`Package ${pkg} is not found in the lock file.`);
      }

      console.log(`Mock ${packageInfo.name} ${packageInfo.version}`);
      micropip.add_mock_package(packageInfo.name, packageInfo.version);
      mockedPackages.push(packageInfo.name);
    });
  }

  console.log(
    `Install the requirements ${JSON.stringify(options.requirements)}`
  );

  await installPackages(pyodide, {
    requirements: options.requirements,
  });

  console.log("Remove the mocked packages", mockedPackages);
  mockedPackages.forEach((pkg) => micropip.remove_mock_package(pkg));

  console.log("Archive the site-packages director(y|ies)");
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

  console.log("Extract the archive file from EMFS");
  const archiveBin = pyodide.FS.readFile(archiveFilePath);

  console.log(`Save the archive file (${options.saveTo})`);
  await fsPromises.writeFile(options.saveTo, archiveBin);
}

interface CopyHomeDirectoryOptions {
  sourceDir: string;
  copyTo: string;
}
async function copyStreamlitAppDirectory(options: CopyHomeDirectoryOptions) {
  console.info("Copy the Streamlit app directory...");

  console.log(`Copy ${options.sourceDir} to ${options.copyTo}`);
  await fsPromises.rm(options.copyTo, { recursive: true, force: true });
  await fsExtra.copy(options.sourceDir, options.copyTo);
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

  console.log("Downloading the used prebuilt packages...");
  await Promise.all(
    usedPrebuiltPackageUrls.map(async (pkgUrl) => {
      const dstPath = path.resolve(
        options.destDir,
        "./pyodide",
        path.basename(pkgUrl)
      );
      console.log(`Download ${pkgUrl} to ${dstPath}`);
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
    "* <appHomeDirSource> [packages..]",
    "Put the user code and data and the snapshot of the required packages into the build artifact.",
    () => {},
    (argv) => {
      console.info(argv);
    }
  )
  .positional("appHomeDirSource", {
    describe:
      "The source directory of the user code and data that will be mounted in the Pyodide file system at app runtime",
    type: "string",
    demandOption: true,
  })
  .positional("packages", {
    describe: "Package names to install.",
    type: "string",
    array: true,
  })
  .options("requirement", {
    describe:
      "Install from the given requirements file. This option can be used multiple times.",
    array: true,
    type: "string",
    alias: "r",
    default: [],
  })
  .options("keepOldBuild", {
    type: "boolean",
    default: false,
    alias: "k",
    describe: "Keep the existing build directory contents except appHomeDir.",
  })
  .parseAsync()
  .then(async (args) => {
    const projectDir = process.cwd();
    const destDir = path.resolve(projectDir, "./build");

    try {
      await fsPromises.access(args.appHomeDirSource);
    } catch {
      throw new Error(`${args.appHomeDirSource} does not exist.`);
    }

    let unvalidatedRequirements = args.packages ?? [];
    for (const requirementTxtFilePath of args.requirement) {
      unvalidatedRequirements = unvalidatedRequirements.concat(
        await readRequirements(requirementTxtFilePath)
      );
    }
    const requirements = validateRequirements(unvalidatedRequirements);

    const usedPrebuiltPackages = await inspectUsedPrebuiltPackages({
      requirements,
    });
    console.log("The prebuilt packages loaded for the given requirements:");
    console.log(usedPrebuiltPackages);

    await copyBuildDirectory({ copyTo: destDir, keepOld: args.keepOldBuild });
    await createSitePackagesSnapshot({
      requirements,
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
    await copyStreamlitAppDirectory({
      sourceDir: args.appHomeDirSource,
      copyTo: path.resolve(destDir, "./streamlit_app"), // This path will be loaded in the `readStreamlitAppDirectory` handler in electron/main.ts.
    });
    await dumpManifest({
      packageJsonPath: path.resolve(projectDir, "./package.json"),
      manifestFilePath: path.resolve(destDir, "./stlite-manifest.json"),
    });
  });
