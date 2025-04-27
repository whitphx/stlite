import path from "node:path";
import * as s from "superstruct";
import { deprecationWarning } from "./logger";

interface ReadConfigOptions {
  pathResolutionRoot: string;
  packageJsonStliteDesktopField: any;
  fallbacks: Partial<{
    // For backward compatibility for the deprecated command line options
    appHomeDirSource: string;
    packages: string[];
    requirementsTxtFilePaths: string[];
  }>;
}
interface ReadConfigResult {
  files: string[];
  entrypoint: string;
  dependencies: string[];
  requirementsTxtFilePaths: string[];
}
export async function readConfig(
  options: ReadConfigOptions,
): Promise<ReadConfigResult> {
  const { files, entrypoint } = readFilesAndEntrypoint(options);
  const dependencies = await readDependencies(options);
  const requirementsTxtFilePaths = await readRequirementsTxtFilePaths(options);

  return {
    files,
    entrypoint,
    dependencies,
    requirementsTxtFilePaths,
  };
}

function readFilesAndEntrypoint(options: ReadConfigOptions) {
  const {
    packageJsonStliteDesktopField,
    fallbacks: { appHomeDirSource: appHomeDirSourceFallback },
  } = options;
  let files = packageJsonStliteDesktopField?.files;
  let entrypoint = packageJsonStliteDesktopField?.entrypoint;
  if (files == null || entrypoint == null) {
    deprecationWarning(
      "Missing `stlite.desktop.files` and `stlite.desktop.entrypoint` in `package.json`. " +
        "Falling back to the `appHomeDirSource` argument to determine the app directory. " +
        "Please update your `package.json` as this fallback is deprecated and will be removed in a future release.",
    );
    const appHomeDirSource = appHomeDirSourceFallback;
    if (typeof appHomeDirSource !== "string") {
      throw new Error(
        "The `appHomeDirSource` argument is required when `stlite.desktop.files` and `stlite.desktop.entrypoint` are not found in the package.json. " +
          "Note that `appHomeDirSource` is deprecated and will be removed in the future, so please specify `stlite.desktop.files` and `stlite.desktop.entrypoint` in the package.json.",
      );
    }
    files = [appHomeDirSource];
    entrypoint = `./${appHomeDirSource}/streamlit_app.py`;
  } else {
    if (appHomeDirSourceFallback != null) {
      deprecationWarning(
        "The `appHomeDirSource` argument is deprecated and has been ignored because `stlite.desktop.files` is specified in `package.json`.",
      );
    }
  }

  s.assert(
    entrypoint,
    s.string(),
    "The `stlite.desktop.entrypoint` field must be a string.",
  );
  s.assert(
    files,
    s.array(s.string()),
    "The `stlite.desktop.files` field must be an array of strings.",
  );

  return { files, entrypoint };
}

async function readDependencies(
  options: ReadConfigOptions,
): Promise<ReadConfigResult["dependencies"]> {
  const {
    packageJsonStliteDesktopField,
    fallbacks: { packages: packagesFallback },
  } = options;

  const dependencies = packageJsonStliteDesktopField?.dependencies;
  s.assert(
    dependencies,
    s.optional(s.array(s.string())),
    "The `stlite.desktop.dependencies` field must be an array of strings.",
  );

  // Below is for backward compatibility for the deprecated command line options
  let dependenciesFromDeprecatedArg: string[] = [];
  if (packagesFallback != null) {
    deprecationWarning(
      "The `packages` argument is deprecated and will be removed in a future release. Use `stlite.desktop.dependencies` in your `package.json` instead.",
    );
    dependenciesFromDeprecatedArg = packagesFallback;
  }

  return [...(dependencies ?? []), ...dependenciesFromDeprecatedArg];
}

async function readRequirementsTxtFilePaths(
  options: ReadConfigOptions,
): Promise<ReadConfigResult["requirementsTxtFilePaths"]> {
  const {
    pathResolutionRoot,
    packageJsonStliteDesktopField,
    fallbacks: { requirementsTxtFilePaths: requirementsTxtFilePathsFallback },
  } = options;

  const requirementsTxtPaths =
    packageJsonStliteDesktopField?.requirementsTxtFiles;
  s.assert(
    requirementsTxtPaths,
    s.optional(s.array(s.string())),
    "The `stlite.desktop.requirementsTxtFiles` field must be an array of strings.",
  );
  const resolvedRequirementsTxtPaths = requirementsTxtPaths?.map((p) =>
    path.resolve(pathResolutionRoot, p),
  );

  // Below is for backward compatibility for the deprecated command line options
  let requirementsTxtFilePathsFromDeprecatedArg: string[] = [];
  if (
    requirementsTxtFilePathsFallback != null &&
    requirementsTxtFilePathsFallback.length > 0
  ) {
    deprecationWarning(
      "The `requirement` argument is deprecated and will be removed in a future release. Use `stlite.desktop.requirementsTxtFiles` in your `package.json` instead.",
    );
    // We don't need to resolve these paths because they are given as command line arguments which are assumed to be relative to the current working directory.
    requirementsTxtFilePathsFromDeprecatedArg =
      requirementsTxtFilePathsFallback;
  }

  return [
    ...(resolvedRequirementsTxtPaths ?? []),
    ...requirementsTxtFilePathsFromDeprecatedArg,
  ];
}
