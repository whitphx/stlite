#!/usr/bin/env yarn ts-node

import path from "path";
import fsPromises from "fs/promises";
import fetch from "node-fetch";
import { loadPyodide, PyodideInterface } from "pyodide";

// @ts-ignore
global.fetch = fetch;  // The global `fetch()` is necessary for micropip.install() to load the remote packages.

async function installLocalWheel(pyodide: PyodideInterface, localPath: string) {
  console.log(`Install the local wheel ${localPath}`)

  const data = await fsPromises.readFile(localPath)
  const emfsPath = "/tmp/" + path.basename(localPath);
  pyodide.FS.writeFile(emfsPath, data);

  const micropip = pyodide.pyimport("micropip");
  const requirement = `emfs:${emfsPath}`
  console.log(`Install ${requirement}`)
  await micropip.install.callKwargs(requirement, { keep_going: true });
}

interface BuildOptions {
  localWheelPaths: {
    tornado: string;
    pyarrow: string;
    streamlit: string;
  };
  requirements: string[];
  saveTo: string;
}

async function main(options: BuildOptions) {
  const pyodide = await loadPyodide();

  await pyodide.loadPackage([
    "micropip",
  ]);

  await installLocalWheel(pyodide, options.localWheelPaths.tornado);
  await installLocalWheel(pyodide, options.localWheelPaths.pyarrow);
  await installLocalWheel(pyodide, options.localWheelPaths.streamlit);

  console.log(`Install the requirements ${JSON.stringify(options.requirements)}`)
  const micropip = pyodide.pyimport("micropip");
  await micropip.install.callKwargs(options.requirements, { keep_going: true });

  console.log("Archive the director(y|ies)")
  const archiveFilePath = '/tmp/stlite-snapshot.tar.gz'
  await pyodide.runPythonAsync(`
    import tarfile
    import site

    site_packages_dirs = site.getsitepackages()

    tar_file_name = '${archiveFilePath}'
    with tarfile.open(tar_file_name, mode='w:gz') as gzf:
        for site_packages in site_packages_dirs:
            gzf.add(site_packages)
  `)

  console.log("Extract the archive file from EMFS")
  const archiveBin = pyodide.FS.readFile(archiveFilePath)

  console.log("Save the archive file")
  await fsPromises.writeFile(options.saveTo, archiveBin);
}

main({
  localWheelPaths: {
    pyarrow: path.resolve(__dirname, "../../stlite-kernel/py/stlite-pyarrow//dist/stlite_pyarrow-0.1.0-py3-none-any.whl"),
    tornado: path.resolve(__dirname, "../../stlite-kernel/py/tornado/dist/tornado-6.2-py3-none-any.whl"),
    streamlit: path.resolve(__dirname, "../../../streamlit/lib/dist/streamlit-1.12.0-py2.py3-none-any.whl"),
  },
  requirements: ["matplotlib"],
  saveTo: "build/stlite-archive.tar.gz"
});
