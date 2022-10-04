#!/usr/bin/env yarn ts-node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import fsPromises from "fs/promises";
import fsExtra from "fs-extra";
import fetch from "node-fetch";
import { loadPyodide, PyodideInterface } from "pyodide";

// @ts-ignore
global.fetch = fetch; // The global `fetch()` is necessary for micropip.install() to load the remote packages.

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
  saveTo: string;
}

async function createSitePackagesSnapshot(
  options: CreateSitePackagesSnapshotOptions
) {
  const pyodide = await loadPyodide();

  await pyodide.loadPackage(["micropip"]);

  if (options.useLocalKernelWheels) {
    const stliteKernelDir = path.dirname(require.resolve("@stlite/kernel")); // -> /path/to/kernel/dist
    const stliteKernelPyDir = path.resolve(stliteKernelDir, "../py"); // -> /path/to/kernel/py
    await installLocalWheel(
      pyodide,
      path.join(stliteKernelPyDir, "tornado/dist/tornado-6.2-py3-none-any.whl")
    );
    await installLocalWheel(
      pyodide,
      path.join(
        stliteKernelPyDir,
        "stlite-pyarrow/dist/stlite_pyarrow-0.1.0-py3-none-any.whl"
      )
    );
    await installLocalWheel(
      pyodide,
      path.join(
        stliteKernelPyDir,
        "streamlit/lib/dist/streamlit-1.13.0-py2.py3-none-any.whl"
      )
    );
  } else {
    const micropip = pyodide.pyimport("micropip");
    const wheelUrls = [
      "https://cdn.jsdelivr.net/npm/@stlite/kernel@0.10.1/py/tornado/dist/tornado-6.2-py3-none-any.whl",
      "https://cdn.jsdelivr.net/npm/@stlite/kernel@0.10.1/py/stlite-pyarrow/dist/stlite_pyarrow-0.1.0-py3-none-any.whl",
      "https://cdn.jsdelivr.net/npm/@stlite/kernel@0.10.1/py/streamlit/lib/dist/streamlit-1.13.0-py2.py3-none-any.whl",
    ];
    console.log("Install", wheelUrls);
    await micropip.install.callKwargs(wheelUrls, { keep_going: true });
  }

  console.log(
    `Install the requirements ${JSON.stringify(options.requirements)}`
  );
  const micropip = pyodide.pyimport("micropip");
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

  console.log("Save the archive file");
  await fsPromises.writeFile(options.saveTo, archiveBin);
}

interface CopyHomeDirectoryOptions {
  sourceDir: string;
  saveTo: string;
}
async function copyHomeDirectory(options: CopyHomeDirectoryOptions) {
  await fsExtra.ensureDir(options.sourceDir);
  return fsExtra.copy(options.sourceDir, options.saveTo);
}

yargs(hideBin(process.argv))
  .command(
    "* <appHomeDirSource>",
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
  .options("requirements", {
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
  .parseAsync()
  .then(async (args) => {
    const destDir = path.resolve(process.cwd(), "./build");
    await fsExtra.ensureDir(destDir);

    await createSitePackagesSnapshot({
      useLocalKernelWheels: args.localKernelWheels,
      requirements: args.requirements,
      saveTo: path.resolve(destDir, "./site-packages-snapshot.tar.gz"), // This path will be loaded in the `readSitePackagesSnapshot` handler in electron/main.ts.
    });
    await copyHomeDirectory({
      sourceDir: args.appHomeDirSource,
      saveTo: path.resolve(destDir, "./streamlit_app"), // This path will be loaded in the `readStreamlitAppDirectory` handler in electron/main.ts.
    });
  });
