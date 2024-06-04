import { PackageData, PyodideInterface } from "pyodide";
import { OutMessage, AutoInstallMessage } from "./types";

// Ref: https://github.com/pyodide/pyodide/blob/0.26.0/src/py/_pyodide/_base.py#L586
const pyCode = `
import ast
from textwrap import dedent


def __find_imports__(source: str) -> list[str]:
    # handle mis-indented input from multi-line strings
    source = dedent(source)

    try:
        mod = ast.parse(source)
    except SyntaxError:
        return []
    imports = set()
    for node in ast.walk(mod):
        if isinstance(node, ast.Import):
            for name in node.names:
                node_name = name.name
                imports.add(node_name.split(".")[0])
        elif isinstance(node, ast.ImportFrom):
            module_name = node.module
            if module_name is None:
                continue
            imports.add(module_name.split(".")[0])
    return list(sorted(imports))
`;

export async function tryModuleAutoLoad(
  pyodide: PyodideInterface,
  postMessage: (message: OutMessage, port: MessagePort) => void,
  sources: string[],
): Promise<PackageData[]> {
  await pyodide.runPythonAsync(pyCode);
  const findImportsFn = pyodide.globals.get("__find_imports__");

  const importsArr = sources.map(
    (source) => findImportsFn(source).toJs() as string[],
  );
  const imports = Array.from(new Set(importsArr.flat()));

  const notFoundImports = imports.filter(
    (name) =>
      !pyodide.runPython(`__import__('importlib').util.find_spec('${name}')`),
  );

  if (notFoundImports.length === 0) {
    return [];
  }

  const packagesToLoad = notFoundImports
    .map((name) =>
      (
        pyodide as unknown as {
          _api: { _import_name_to_package_name: Map<string, string> };
        }
      )._api._import_name_to_package_name.get(name),
    )
    .filter((name) => name) as string[];

  return executeModuleAutoLoad(pyodide, postMessage, packagesToLoad);
}

export async function executeModuleAutoLoad(
  pyodide: PyodideInterface,
  postMessage: (message: OutMessage, port: MessagePort) => void,
  importName: string | string[],
): Promise<PackageData[]> {
  const importNames = Array.isArray(importName) ? importName : [importName];
  console.debug(`Auto import the modules: ${importNames}`);
  const packageNames = importNames
    .map((importName) => {
      const packageName = (
        pyodide as unknown as {
          _api: { _import_name_to_package_name: Map<string, string> };
        }
      )._api._import_name_to_package_name.get(importName);
      if (packageName == null) {
        console.warn(`The package name for ${importName} is not found.`);
        return;
      }
      return packageName;
    })
    .filter((packageName) => packageName != null) as string[];
  if (packageNames.length === 0) {
    return [];
  }

  console.debug(`Auto install the packages: ${packageNames}`);
  const channel = new MessageChannel();
  postMessage(
    {
      type: "event:autoinstall",
    },
    channel.port2,
  );

  try {
    const loadedPackages = await pyodide.loadPackage(packageNames);
    channel.port1.postMessage({
      type: "autoinstall:success",
      data: {
        packages: loadedPackages,
      },
    } as AutoInstallMessage);
    channel.port1.close();
    return loadedPackages;
  } catch (error) {
    channel.port1.postMessage({
      type: "autoinstall:error",
      error: error as Error,
    } as AutoInstallMessage);
    channel.port1.close();
    throw error;
  }
}
