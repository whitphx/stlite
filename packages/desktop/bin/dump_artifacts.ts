#!/usr/bin/env yarn ts-node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import fsPromises from "fs/promises";
import fsExtra from "fs-extra";
import fetch from "node-fetch";
import {
  loadPyodide,
  type PyodideInterface,
  version as pyodideVersion,
} from "pyodide";
import { parseRequirementsTxt } from "@stlite/common";
import type { DesktopAppManifest } from "../electron/main";

// @ts-ignore
global.fetch = fetch; // The global `fetch()` is necessary for micropip.install() to load the remote packages.

function makePyodideUrl(filename: string): string {
  return `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/${filename}`;
}

interface CopyBuildDirectoryOptions {
  keepOld: boolean;
  copyTo: string;
}
async function copyBuildDirectory(options: CopyBuildDirectoryOptions) {
  console.info(
    "Copy the build directory (the bare built app files) to this directory..."
  );

  const sourceDir = path.resolve(__dirname, "../build");
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

interface InspectUsedBuiltinPackagesOptions {
  requirements: string[];
  useLocalKernelWheels: boolean;
}
/**
 * Get the list of the built-in packages used by the given requirements.
 * These package files (`pyodide/*.whl`) will be vendored in the app executable
 * and loaded at runtime to avoid problems such as https://github.com/whitphx/stlite/issues/558
 */
async function inspectUsedBuiltinPackages(
  options: InspectUsedBuiltinPackagesOptions
): Promise<string[]> {
  if (options.requirements.length === 0) {
    return [];
  }

  const pyodide = await loadPyodide();

  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");

  micropip.add_mock_package("streamlit", "1.24.0");

  await micropip.install(options.requirements);
  return Object.entries(pyodide.loadedPackages)
    .filter(([, channel]) => channel === "default channel")
    .map(([name]) => name);
}

async function loadPyodideBuiltinPackageData(): Promise<
  Record<
    string,
    { name: string; version: string; file_name: string; depends: string[] }
  >
> {
  const url = makePyodideUrl("repodata.json");

  console.log(`Load the Pyodide repodata.json from ${url}`);
  const res = await fetch(url);
  const resJson = await res.json();

  return resJson.packages;
}

async function installLocalWheel(pyodide: PyodideInterface, localPath: string) {
  console.log(`Install the local wheel ${localPath}`);

  const data = await fsPromises.readFile(localPath);
  const emfsPath = "/tmp/" + path.basename(localPath);
  pyodide.FS.writeFile(emfsPath, data);

  const micropip = pyodide.pyimport("micropip");
  const requirement = `emfs:${emfsPath}`;
  console.log(`Install ${requirement}`);
  await micropip.install.callKwargs(requirement, { keep_going: true });
}

interface CreateSitePackagesSnapshotOptions {
  useLocalKernelWheels: boolean;
  requirements: string[];
  usedBuiltinPackages: string[];
  saveTo: string;
}
async function createSitePackagesSnapshot(
  options: CreateSitePackagesSnapshotOptions
) {
  console.info("Create the site-packages snapshot file...");

  const pyodide = await loadPyodide();

  await pyodide.loadPackage(["micropip"]);

  if (options.useLocalKernelWheels) {
    const stliteKernelDir = path.dirname(require.resolve("@stlite/kernel")); // -> /path/to/kernel/dist
    const stliteKernelPyDir = path.resolve(stliteKernelDir, "../py"); // -> /path/to/kernel/py
    // TODO: Set the wheel file names dynamically
    await installLocalWheel(
      pyodide,
      path.join(
        stliteKernelPyDir,
        "stlite-server/dist/stlite_server-0.1.0-py3-none-any.whl"
      )
    );
    await installLocalWheel(
      pyodide,
      path.join(
        stliteKernelPyDir,
        "streamlit/lib/dist/streamlit-1.24.0-cp311-none-any.whl"
      )
    );
  } else {
    const packageJson = require(path.resolve(__dirname, "../package.json"));
    const version = packageJson.version;

    const jsDelivrFilesUrl = `https://data.jsdelivr.com/v1/package/npm/@stlite/kernel@${version}/flat`;
    const jsDelivrFilesRes = await fetch(jsDelivrFilesUrl);
    const jsDelivrFilesJson = await jsDelivrFilesRes.json();
    const wheelFiles = jsDelivrFilesJson.files.filter((fileData) =>
      fileData.name.endsWith(".whl")
    );
    const wheelUrls = wheelFiles.map(
      (wheelFile) =>
        `https://cdn.jsdelivr.net/npm/@stlite/kernel@${version}${wheelFile.name}`
    );

    const micropip = pyodide.pyimport("micropip");
    console.log("Install", wheelUrls);
    await micropip.install.callKwargs(wheelUrls, { keep_going: true });
  }

  const micropip = pyodide.pyimport("micropip");

  const pyodideBuiltinPackageMap = await loadPyodideBuiltinPackageData();

  if (options.usedBuiltinPackages.length > 0) {
    console.log(
      "Mocking builtin packages so that they will not be included in the site-packages snapshot because these will be installed from the vendored wheel files at runtime..."
    );
    options.usedBuiltinPackages.forEach((pkg) => {
      const packageInfo = pyodideBuiltinPackageMap[pkg];
      if (packageInfo == null) {
        throw new Error(`Package ${pkg} is not found in the lock file.`);
      }

      console.log(`Mock ${packageInfo.name} ${packageInfo.version}`);
      micropip.add_mock_package(packageInfo.name, packageInfo.version);
    });
  }

  console.log(
    `Install the requirements ${JSON.stringify(options.requirements)}`
  );

  await micropip.install.callKwargs(options.requirements, { keep_going: true });

  console.log("Archive the site-packages director(y|ies)");
  const archiveFilePath = "/tmp/site-packages-snapshot.tar.gz";
  await pyodide.runPythonAsync(`
    import tarfile
    import site

    site_packages_dirs = site.getsitepackages()

    tar_file_name = '${archiveFilePath}'
    with tarfile.open(tar_file_name, mode='w:gz') as gzf:
        for site_packages in site_packages_dirs:
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

async function writeRequirements(
  requirementsTxtPath: string,
  requirements: string[]
): Promise<void> {
  const requirementsTxtData = requirements.join("\n");
  await fsPromises.writeFile(requirementsTxtPath, requirementsTxtData, {
    encoding: "utf-8",
  });
}

// Original: kernel/src/requirements.ts
// TODO: Be DRY
function verifyRequirements(requirements: string[]) {
  requirements.forEach((req) => {
    let url: URL;
    try {
      url = new URL(req);
    } catch {
      // `req` is not a URL -> OK
      return;
    }

    // Ref: The scheme checker in the micropip implementation is https://github.com/pyodide/micropip/blob/v0.1.0/micropip/_compat_in_pyodide.py#L23-L26
    if (url.protocol === "emfs:" || url.protocol === "file:") {
      throw new Error(
        `"emfs:" and "file:" protocols are not allowed for the requirement (${req})`
      );
    }
  });
}

interface DownloadPyodideBuiltinPackageWheelsOptions {
  packages: string[];
  destDir: string;
}
async function downloadPyodideBuiltinPackageWheels(
  options: DownloadPyodideBuiltinPackageWheelsOptions
) {
  const pyodideBuiltinPackages = await loadPyodideBuiltinPackageData();
  const usedBuiltInPackages = options.packages.map(
    (pkgName) => pyodideBuiltinPackages[pkgName]
  );
  const usedBuiltinPackageUrls = usedBuiltInPackages.map((pkg) =>
    makePyodideUrl(pkg.file_name)
  );

  console.log("Downloading the used built-in packages...");
  await Promise.all(
    usedBuiltinPackageUrls.map(async (pkgUrl) => {
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

interface DumpManifestOptions {
  packageJsonPath: string;
  manifestFilePath: string;
}
async function dumpManifest(options: DumpManifestOptions) {
  const packageJson = require(options.packageJsonPath);
  const stliteManifest = packageJson.stlite?.desktop || {};
  const manifestData: DesktopAppManifest = {
    embed: stliteManifest.embed || false,
  };

  const manifestDataStr = JSON.stringify(manifestData, null, 2);
  console.log(`Dump the manifest file -> ${options.manifestFilePath}`);
  console.log(manifestDataStr);
  await fsPromises.writeFile(options.manifestFilePath, manifestDataStr, {
    encoding: "utf-8",
  });
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
  .options("localKernelWheels", {
    describe: "Use the locally installed kernel wheels",
    type: "boolean",
    alias: "l",
    default: false,
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

    let requirements = args.packages;
    for (const requirementTxtFilePath of args.requirement) {
      requirements = requirements.concat(
        await readRequirements(requirementTxtFilePath)
      );
    }
    verifyRequirements(requirements);

    const usedBuiltinPackages = await inspectUsedBuiltinPackages({
      requirements: requirements,
      useLocalKernelWheels: args.localKernelWheels,
    });
    console.log("The built-in packages loaded for the given requirements:");
    console.log(usedBuiltinPackages);

    await copyBuildDirectory({ copyTo: destDir, keepOld: args.keepOldBuild });
    await createSitePackagesSnapshot({
      useLocalKernelWheels: args.localKernelWheels,
      requirements: requirements,
      usedBuiltinPackages,
      saveTo: path.resolve(destDir, "./site-packages-snapshot.tar.gz"), // This path will be loaded in the `readSitePackagesSnapshot` handler in electron/main.ts.
    });
    // The `requirements.txt` file will be needed to call `micropip.install()` at runtime.
    // The built-in packages will be vendored in the build artifact as wheel files
    // and `micropip.install()` will install them at runtime,
    // while the packages downloaded from PyPI will have been included in the site-packages snapshot.
    await writeRequirements(
      path.resolve(destDir, "./requirements.txt"), // This path will be loaded in the `readRequirements` handler in electron/main.ts.
      requirements
    );
    await copyStreamlitAppDirectory({
      sourceDir: args.appHomeDirSource,
      copyTo: path.resolve(destDir, "./streamlit_app"), // This path will be loaded in the `readStreamlitAppDirectory` handler in electron/main.ts.
    });
    await downloadPyodideBuiltinPackageWheels({
      packages: usedBuiltinPackages,
      destDir,
    });
    await dumpManifest({
      packageJsonPath: path.resolve(projectDir, "./package.json"),
      manifestFilePath: path.resolve(destDir, "./stlite-manifest.json"),
    });
  });
