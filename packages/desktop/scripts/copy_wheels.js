#!/usr/bin/env node

// Copy wheels from the `@stlite/kernel` package to the `wheels` directory.

const fsPromises = require("fs/promises");
const path = require("path");

async function copyFileToDir(filePath, dirPath) {
  const fileName = path.basename(filePath);
  const destPath = path.join(dirPath, fileName);
  await fsPromises.copyFile(filePath, destPath);
}

async function main() {
  const stliteKernelDir = path.dirname(require.resolve("@stlite/kernel")); // -> /path/to/kernel/dist
  const stliteKernelPyDir = path.resolve(stliteKernelDir, "../py"); // -> /path/to/kernel/py

  // TODO: Set the wheel file names dynamically
  const stliteLibWheelPath = path.join(
    stliteKernelPyDir,
    "stlite-lib/dist/stlite_lib-0.1.0-py3-none-any.whl",
  );
  const streamlitWheelPath = path.join(
    stliteKernelPyDir,
    "streamlit/lib/dist/streamlit-1.39.0-cp312-none-any.whl",
  );

  // Create the `wheels` directory
  const wheelsDir = path.join(__dirname, "../wheels");
  if (
    await fsPromises.stat(wheelsDir).catch((error) => error.code !== "ENOENT")
  ) {
    await fsPromises.rm(wheelsDir, { recursive: true });
  }
  await fsPromises.mkdir(wheelsDir);

  // Copy the wheels to the `wheels` directory
  await copyFileToDir(stliteLibWheelPath, wheelsDir);
  await copyFileToDir(streamlitWheelPath, wheelsDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
