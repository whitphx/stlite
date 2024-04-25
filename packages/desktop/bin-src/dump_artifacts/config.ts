interface ReadConfigOptions {
  packageJsonStliteDesktopField: any;
  fallbackAppHomeDirSource: string | undefined; // For backward compatibility for the deprecated command line options
}
interface ReadConfigResult {
  includes: string[];
  entrypoint: string;
}
export function readConfig(options: ReadConfigOptions): ReadConfigResult {
  const { packageJsonStliteDesktopField, fallbackAppHomeDirSource } = options;
  let includes = packageJsonStliteDesktopField?.includes;
  let entrypoint = packageJsonStliteDesktopField?.entrypoint;
  if (includes == null || entrypoint == null) {
    console.warn(
      "`stlite.desktop.includes` and `stlite.desktop.entrypoint` are not found in `package.json`."
    );
    console.warn("Read the `appHomeDirSource` argument as the app directory.");
    console.warn("This behavior will be deprecated in the future.");
    const appHomeDirSource = fallbackAppHomeDirSource;
    if (typeof appHomeDirSource !== "string") {
      throw new Error(
        "The `appHomeDirSource` argument is required when `stlite.desktop.includes` and `stlite.desktop.entrypoint` are not found in the package.json.\n" +
          "Note that `appHomeDirSource` is deprecated and will be removed in the future, so please specify `stlite.desktop.includes` and `stlite.desktop.entrypoint` in the package.json."
      );
    }
    includes = [appHomeDirSource];
    entrypoint = `./${appHomeDirSource}/streamlit_app.py`;
  } else {
    if (fallbackAppHomeDirSource != null) {
      console.warn(
        "`appHomeDirSource` is ignored because `stlite.desktop.includes` is found in `package.json`."
      );
    }
  }

  if (entrypoint == null) {
    throw new Error(
      "The `stlite.desktop.entrypoint` field is not found in the package.json."
    );
  }
  if (
    !Array.isArray(includes) ||
    !includes.every((x) => typeof x === "string")
  ) {
    throw new Error(
      "The `stlite.desktop.includes` field must be an array of strings."
    );
  }

  return {
    includes,
    entrypoint,
  };
}
