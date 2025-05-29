#!/usr/bin/env node

// Copy wheels from the `@stlite/kernel` package to the `wheels` directory.

import fsPromises from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getStreamlitVersion } from "@stlite/devutils";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyFileToDir(filePath, dirPath) {
  const fileName = path.basename(filePath);
  const destPath = path.join(dirPath, fileName);
  await fsPromises.copyFile(filePath, destPath);
}

const stliteKernelDir = path.dirname(
  fileURLToPath(import.meta.resolve("@stlite/kernel")),
); // -> /path/to/kernel/dist
const stliteKernelPyDir = path.resolve(stliteKernelDir, "../py"); // -> /path/to/kernel/py

const streamlitVersion = getStreamlitVersion();

const stliteLibWheelPath = path.join(
  stliteKernelPyDir,
  "stlite-lib/dist/stlite_lib-0.1.0-py3-none-any.whl",
);
const streamlitWheelPath = path.join(
  stliteKernelPyDir,
  `streamlit/lib/dist/streamlit-${streamlitVersion}-cp312-none-any.whl`,
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
