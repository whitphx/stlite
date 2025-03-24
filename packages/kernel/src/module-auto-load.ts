import type { PackageData, PyodideInterface } from "pyodide";

export type ModuleAutoLoadCallback = (
  packagesToLoad: string[],
  packageLoadPromise: Promise<PackageData[]>,
) => void;

function tryModuleAutoLoad(
  pyodide: PyodideInterface,
  callback: ModuleAutoLoadCallback,
  sources: string[],
): Promise<void> {
  // Ref: `pyodide.loadPackagesFromImports` (https://github.com/pyodide/pyodide/blob/0.26.0/src/js/api.ts#L191)

  const pyodidePy = pyodide.pyimport("pyodide");
  const findImports = (source: string): string[] =>
    pyodidePy.code.find_imports(source).toJs();

  const importsArr = sources.map((source) => findImports(source));
  const imports = Array.from(new Set(importsArr.flat()));

  const notFoundImports = imports.filter(
    (name) =>
      !pyodide.runPython(`__import__('importlib').util.find_spec('${name}')`),
  );

  const packagesToLoad = notFoundImports
    .map((name) =>
      (
        pyodide as unknown as {
          _api: { _import_name_to_package_name: Map<string, string> };
        }
      )._api._import_name_to_package_name.get(name),
    )
    .filter((name) => name) as string[];

  if (packagesToLoad.length === 0) {
    return Promise.resolve();
  }

  const packageLoadPromise = pyodide.loadPackage(packagesToLoad);
  callback(packagesToLoad, packageLoadPromise);

  return packageLoadPromise.then();
}

export function dispatchModuleAutoLoading(
  pyodide: PyodideInterface,
  callback: ModuleAutoLoadCallback,
  sources: string[],
) {
  const autoLoadPromise = tryModuleAutoLoad(pyodide, callback, sources);
  // `autoInstallPromise` will be awaited in the script_runner on the Python side.
  const setModuleAutoLoadPromise = pyodide.runPython(`
def __set_module_auto_load_promise__(promise):
    from streamlit.runtime.scriptrunner import script_runner
    script_runner.moduleAutoLoadPromise = promise

__set_module_auto_load_promise__`); // The last line evaluates to the function so it is returned from pyodide.runPython() to the JS side.
  setModuleAutoLoadPromise(autoLoadPromise);
}
