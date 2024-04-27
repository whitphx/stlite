import path from "node:path";
import * as s from "superstruct";

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
  options: ReadConfigOptions
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
    console.warn(
      "`stlite.desktop.files` and `stlite.desktop.entrypoint` are not found in `package.json`. " +
        "Read the `appHomeDirSource` argument as the app directory. " +
        "This behavior will be deprecated in the future."
    );
    const appHomeDirSource = appHomeDirSourceFallback;
    if (typeof appHomeDirSource !== "string") {
      throw new Error(
        "The `appHomeDirSource` argument is required when `stlite.desktop.files` and `stlite.desktop.entrypoint` are not found in the package.json.\n" +
          "Note that `appHomeDirSource` is deprecated and will be removed in the future, so please specify `stlite.desktop.files` and `stlite.desktop.entrypoint` in the package.json."
      );
    }
    files = [appHomeDirSource];
    entrypoint = `./${appHomeDirSource}/streamlit_app.py`;
  } else {
    if (appHomeDirSourceFallback != null) {
      console.warn(
        "[Deprecated] `appHomeDirSource` is ignored because `stlite.desktop.files` is found in `package.json`."
      );
    }
  }

  s.assert(
    entrypoint,
    s.string(),
    "The `stlite.desktop.entrypoint` field must be a string."
  );
  s.assert(
    files,
    s.array(s.string()),
    "The `stlite.desktop.files` field must be an array of strings."
  );

  return { files, entrypoint };
}

async function readDependencies(
  options: ReadConfigOptions
): Promise<ReadConfigResult["dependencies"]> {
  const {
    packageJsonStliteDesktopField,
    fallbacks: { packages: packagesFallback },
  } = options;

  let dependenciesFromPackageJson = packageJsonStliteDesktopField?.dependencies;
  s.assert(
    dependenciesFromPackageJson,
    s.optional(s.array(s.string())),
    "The `stlite.desktop.dependencies` field must be an array of strings."
  );

  // Below is for backward compatibility for the deprecated command line options
  let requirementsFromDeprecatedArg: string[] = [];
  if (packagesFallback != null) {
    console.warn(
      "The `packages` argument is deprecated and will be removed in the future. Please specify `stlite.desktop.dependencies` in the package.json for that purpose."
    );
    requirementsFromDeprecatedArg = packagesFallback;
  }

  return [
    ...(dependenciesFromPackageJson ?? []),
    ...requirementsFromDeprecatedArg,
  ];
}

async function readRequirementsTxtFilePaths(
  options: ReadConfigOptions
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
    "The `stlite.desktop.requirementsTxtFiles` field must be an array of strings."
  );
  const resolvedRequirementsTxtPaths = requirementsTxtPaths?.map((p) =>
    path.resolve(pathResolutionRoot, p)
  );

  // Below is for backward compatibility for the deprecated command line options
  let requirementsTxtFilePathsFromDeprecatedArg: string[] = [];
  if (
    requirementsTxtFilePathsFallback != null &&
    requirementsTxtFilePathsFallback.length > 0
  ) {
    console.warn(
      "The `requirement` argument is deprecated and will be removed in the future. Please specify `stlite.desktop.requirementsTxtFiles` in the package.json for that purpose."
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
