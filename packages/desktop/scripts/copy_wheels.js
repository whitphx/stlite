#!/usr/bin/env node

// Copy wheels from the `@stlite/kernel` package to the `wheels` directory.

const fs = require("fs-extra");
const path = require("path");

async function copyFileToDir(filePath, dirPath) {
  const fileName = path.basename(filePath);
  const destPath = path.join(dirPath, fileName);
  await fs.copy(filePath, destPath);
}

async function main() {
  const stliteKernelDir = path.dirname(require.resolve("@stlite/kernel")); // -> /path/to/kernel/dist
  const stliteKernelPyDir = path.resolve(stliteKernelDir, "../py"); // -> /path/to/kernel/py

  // TODO: Set the wheel file names dynamically
  const stliteServerWheelPath = path.join(
    stliteKernelPyDir,
    "stlite-server/dist/stlite_server-0.1.0-py3-none-any.whl"
  );
  const streamlitWheelPath = path.join(
    stliteKernelPyDir,
    "streamlit/lib/dist/streamlit-1.30.0-cp311-none-any.whl"
  );

  // Create the `wheels` directory if it doesn't exist
  const wheelsDir = path.join(__dirname, "../wheels");

  if (await fs.pathExists(wheelsDir)) {
    await fs.emptyDir(wheelsDir);
  } else {
    await fs.mkdir(wheelsDir);
  }

  // Copy the wheels to the `wheels` directory
  await copyFileToDir(stliteServerWheelPath, wheelsDir);
  await copyFileToDir(streamlitWheelPath, wheelsDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
