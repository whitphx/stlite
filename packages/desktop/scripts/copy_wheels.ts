#!/usr/bin/env node

// Copy wheels from the `@stlite/kernel` package to the `wheels` directory.

import * as fsPromises from "node:fs/promises";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyFileToDir(filePath: string, dirPath: string): Promise<void> {
  const fileName = path.basename(filePath);
  const destPath = path.join(dirPath, fileName);
  await fsPromises.copyFile(filePath, destPath);
}

async function main(): Promise<void> {
  const stliteKernelDir = path.dirname(require.resolve("@stlite/kernel")); // -> /path/to/kernel/dist
  const stliteKernelPyDir = path.resolve(stliteKernelDir, "../py"); // -> /path/to/kernel/py

  // TODO: Set the wheel file names dynamically
  const stliteLibWheelPath = path.join(
    stliteKernelPyDir,
    "stlite-lib/dist/stlite_lib-0.1.0-py3-none-any.whl",
  );
  const streamlitVersion = process.env.STREAMLIT_VERSION || "1.41.0";
  const streamlitWheelPath = path.join(
    stliteKernelPyDir,
    `streamlit/lib/dist/streamlit-${streamlitVersion}-cp312-none-any.whl`,
  );

  // Create the `wheels` directory
  const wheelsDir = path.join(__dirname, "../wheels");
  if (
    await fsPromises
      .stat(wheelsDir)
      .catch((error: NodeJS.ErrnoException) => error.code !== "ENOENT")
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
