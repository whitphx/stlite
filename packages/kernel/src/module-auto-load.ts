import type { PackageData, PyodideInterface } from "pyodide";

export function tryModuleAutoLoad(
  pyodide: PyodideInterface,
  callback: (packagesToLoad: string[], onLoad: Promise<PackageData[]>) => void,
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
