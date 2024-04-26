import fsPromises from "fs/promises";
import * as s from "superstruct";
import { parseRequirementsTxt } from "@stlite/common";

interface ReadConfigOptions {
  packageJsonStliteDesktopField: any;
  fallbacks: Partial<{
    // For backward compatibility for the deprecated command line options
    appHomeDirSource: string;
    packages: string[];
    requirementTxtFilePaths: string[];
  }>;
}
interface ReadConfigResult {
  files: string[];
  entrypoint: string;
  dependencies: string[];
}
export async function readConfig(
  options: ReadConfigOptions
): Promise<ReadConfigResult> {
  const { files, entrypoint } = readFilesAndEntrypoint(options);
  const dependencies = await readDependencies(options);

  return {
    files,
    entrypoint,
    dependencies,
  };
}

function readFilesAndEntrypoint(options: ReadConfigOptions) {
  const {
    packageJsonStliteDesktopField,
    fallbacks: { appHomeDirSource: fallbackAppHomeDirSource },
  } = options;
  let files = packageJsonStliteDesktopField?.files;
  let entrypoint = packageJsonStliteDesktopField?.entrypoint;
  if (files == null || entrypoint == null) {
    console.warn(
      "`stlite.desktop.files` and `stlite.desktop.entrypoint` are not found in `package.json`. " +
        "Read the `appHomeDirSource` argument as the app directory. " +
        "This behavior will be deprecated in the future."
    );
    const appHomeDirSource = fallbackAppHomeDirSource;
    if (typeof appHomeDirSource !== "string") {
      throw new Error(
        "The `appHomeDirSource` argument is required when `stlite.desktop.files` and `stlite.desktop.entrypoint` are not found in the package.json.\n" +
          "Note that `appHomeDirSource` is deprecated and will be removed in the future, so please specify `stlite.desktop.files` and `stlite.desktop.entrypoint` in the package.json."
      );
    }
    files = [appHomeDirSource];
    entrypoint = `./${appHomeDirSource}/streamlit_app.py`;
  } else {
    if (fallbackAppHomeDirSource != null) {
      console.warn(
        "[Deprecated] `appHomeDirSource` is ignored because `stlite.desktop.files` is found in `package.json`."
      );
    }
  }

  if (entrypoint == null) {
    throw new Error(
      "The `stlite.desktop.entrypoint` field is not found in the package.json."
    );
  }
  if (!Array.isArray(files) || !files.every((x) => typeof x === "string")) {
    throw new Error(
      "The `stlite.desktop.files` field must be an array of strings."
    );
  }

  return { files, entrypoint };
}

async function readDependencies(options: ReadConfigOptions): Promise<string[]> {
  const {
    packageJsonStliteDesktopField,
    fallbacks: {
      packages: packagesFallback,
      requirementTxtFilePaths: requirementTxtFilePathsFallback,
    },
  } = options;

  let dependenciesFromPackageJson = packageJsonStliteDesktopField?.dependencies;
  s.assert(
    dependenciesFromPackageJson,
    s.optional(s.array(s.string())),
    "The `stlite.desktop.dependencies` field must be an array of strings."
  );

  const requirementsTxtPaths =
    packageJsonStliteDesktopField?.requirementsTxtFiles;
  s.assert(
    requirementsTxtPaths,
    s.optional(s.array(s.string())),
    "The `stlite.desktop.requirementsTxtFiles` field must be an array of strings."
  );
  const dependenciesFromRequirementsTxt = requirementsTxtPaths
    ? await Promise.all(
        requirementsTxtPaths.map(async (requirementsTxtPath) => {
          const requirementsTxtData = await fsPromises.readFile(
            requirementsTxtPath,
            {
              encoding: "utf-8",
            }
          );
          const parsedRequirements = parseRequirementsTxt(requirementsTxtData);
          return parsedRequirements;
        })
      ).then((parsedRequirements) => parsedRequirements.flat())
    : [];

  const dependencies = [
    ...(dependenciesFromPackageJson ?? []),
    ...dependenciesFromRequirementsTxt,
  ];

  // Below is for backward compatibility for the deprecated command line options
  let requirementsFromDeprecatedArgs: string[] = [];
  if (packagesFallback != null) {
    console.warn(
      "The `packages` argument is deprecated and will be removed in the future. Please specify `stlite.desktop.dependencies` in the package.json for that purpose."
    );
    requirementsFromDeprecatedArgs =
      requirementsFromDeprecatedArgs.concat(packagesFallback);
  }
  if (requirementTxtFilePathsFallback != null) {
    console.warn(
      "The `requirement` argument is deprecated and will be removed in the future. Please specify `stlite.desktop.requirementsTxtFiles` in the package.json for that purpose."
    );
    for (const requirementTxtFilePath of requirementTxtFilePathsFallback) {
      const requirementsTxtData = await fsPromises.readFile(
        requirementTxtFilePath,
        {
          encoding: "utf-8",
        }
      );
      const parsedRequirements = parseRequirementsTxt(requirementsTxtData);
      requirementsFromDeprecatedArgs =
        requirementsFromDeprecatedArgs.concat(parsedRequirements);
    }
  }

  return [...dependencies, ...requirementsFromDeprecatedArgs];
}
