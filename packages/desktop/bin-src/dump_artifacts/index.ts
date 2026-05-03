#!/usr/bin/env yarn ts-node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "node:path";
import fsPromises from "node:fs/promises";
import { fileURLToPath } from "node:url";
import fsExtra from "fs-extra";
import {
  packageApp,
  readRequirementsTxt,
  DEFAULT_PYODIDE_SOURCE,
  normalizePyodideSource,
  type Logger,
} from "@stlite/app-packager";
import { validateRequirements } from "@stlite/common";
import { dumpManifest } from "../../electron/manifest";
import { readConfig } from "./config";
import { logger } from "./logger";

const pathFromScriptToBuild =
  process.env.PATH_FROM_SCRIPT_TO_BUILD ?? "../../build";
const pathFromScriptToWheels =
  process.env.PATH_FROM_SCRIPT_TO_WHEELS ?? "../../wheels";
const streamlitWheelFileName =
  process.env.STREAMLIT_WHEEL_FILE_NAME ??
  (await (async () => {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("This code block is development purpose only.");
    }
    // @ts-expect-error  This code block is development purpose only.
    const { getStreamlitWheelFileName } = await import("@stlite/tooling");
    return getStreamlitWheelFileName();
  })());
const stliteLibWheelFileName =
  process.env.STLITE_LIB_WHEEL_FILE_NAME ?? `stlite_lib-0.1.0-py3-none-any.whl`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const winstonAdapter: Logger = {
  debug: (msg, ...meta) => logger.debug(msg, ...meta),
  info: (msg, ...meta) => logger.info(msg, ...meta),
  warn: (msg, ...meta) => logger.warn(msg, ...meta),
  error: (msg, ...meta) => logger.error(msg, ...meta),
};

interface CopyShellDirectoryOptions {
  sourceDir: string;
  destDir: string;
  keepOld: boolean;
}
async function copyShellDirectory(options: CopyShellDirectoryOptions) {
  logger.info(
    "Copy the desktop SPA shell (the bare built app files) to the destination directory...",
  );

  const sourceDirStat = await fsPromises.stat(options.sourceDir);
  if (!sourceDirStat.isDirectory()) {
    throw new Error(`The source ${options.sourceDir} does not exist.`);
  }

  if (options.sourceDir === options.destDir) {
    logger.warn(
      `sourceDir == destDir (${options.sourceDir}). Are you in the development environment? Skip copying the directory.`,
    );
    return;
  }

  if (options.keepOld) {
    try {
      await fsPromises.access(options.destDir);
      logger.info(
        `${options.destDir} already exists. Use it and skip copying.`,
      );
      return;
    } catch {
      throw new Error(
        `${options.destDir} does not exist even though the \`keepOld\` option is specified`,
      );
    }
  }

  logger.debug(`Copy ${options.sourceDir} to ${options.destDir}`);
  await fsPromises.rm(options.destDir, { recursive: true, force: true });
  await fsExtra.copy(options.sourceDir, options.destDir, {
    errorOnExist: true,
  });
}

yargs(hideBin(process.argv))
  .command(
    "* [appHomeDirSource] [packages..]",
    "Put the user code and data and the snapshot of the required packages into the build artifact.",
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
  .options("pyodideSource", {
    type: "string",
    describe:
      "The base URL or path of the Pyodide files to download or copy, such as the prebuild package wheels and pyodide-lock.json",
    default: DEFAULT_PYODIDE_SOURCE,
    coerce: normalizePyodideSource,
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
    const packageJson = await fsExtra.readJson(packageJsonPath);

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
      config.requirementsTxtFilePaths,
    );

    const dependenciesFromRequirementsTxt = (
      await Promise.all(
        config.requirementsTxtFilePaths.map(readRequirementsTxt),
      )
    ).flat();
    logger.info(
      "Dependencies from `requirements.txt` files: %j",
      dependenciesFromRequirementsTxt,
    );

    const dependencies = validateRequirements([
      ...config.dependencies,
      ...dependenciesFromRequirementsTxt,
    ]);
    logger.info("Validated dependency list: %j", dependencies);

    // Step 1: lay down the desktop SPA shell into destDir.
    await copyShellDirectory({
      sourceDir: path.resolve(__dirname, pathFromScriptToBuild),
      destDir,
      keepOld: args.keepOldBuild,
    });

    // Step 2: vendor Pyodide deps + copy app files + write prebuilt-packages.txt.
    const wheelsDir = path.join(__dirname, pathFromScriptToWheels);
    await packageApp({
      destDir,
      sourceDir: projectDir,
      files: config.files,
      entrypoint: config.entrypoint,
      dependencies,
      localWheelPaths: [
        path.join(wheelsDir, stliteLibWheelFileName),
        path.join(wheelsDir, streamlitWheelFileName),
      ],
      pyodideSource: args.pyodideSource,
      logger: winstonAdapter,
    });

    // Step 3: desktop-specific manifest.
    await dumpManifest({
      packageJsonStliteDesktopField: packageJson.stlite?.desktop,
      manifestFilePath: path.resolve(destDir, "./stlite-manifest.json"),
      fallbacks: {
        entrypoint: config.entrypoint, // Fallback to the `entrypoint` argument if the `stlite.desktop.entrypoint` field is not found in the `package.json`. This is for backward compatibility and will be deprecated in the future.
      },
    });
  });
