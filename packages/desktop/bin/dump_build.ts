#!/usr/bin/env yarn ts-node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import fsPromises from "fs/promises";
import fsExtra from "fs-extra";

yargs(hideBin(process.argv))
  .command(
    "*",
    "Copy the build directory into the current directory.",
    () => {},
    (argv) => {
      console.info(argv);
    }
  )
  .options("force", {
    type: "boolean",
    default: false,
    alias: "f",
    describe:
      "Forcefully copy the directory even if the destination directory already exists.",
  })
  .parseAsync()
  .then(async (args) => {
    const sourceDir = path.resolve(__dirname, "../build");
    const sourceDirStat = await fsPromises.stat(sourceDir);
    if (!sourceDirStat.isDirectory()) {
      throw new Error(`The source ${sourceDir} does not exist.`);
    }

    const destDir = path.resolve(process.cwd(), "./build");

    if (sourceDir === destDir) {
      throw new Error(
        `sourceDir == destDir (${sourceDir}). Are you in the development environment?`
      );
    }

    if (!args.force) {
      try {
        await fsPromises.access(destDir);
        console.error(`ERROR: ${destDir} already exists`);
        process.exit(-1);
      } catch {}
    }

    console.log(`Copy ${sourceDir} to ${destDir}`);
    fsExtra.copy(sourceDir, destDir);
  });
