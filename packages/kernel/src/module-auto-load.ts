import type { PackageData, PyodideInterface } from "pyodide";
import type { AutoInstallMessage } from "./types";
import type { PostMessageFn } from "./worker-runtime";

function findImports(pyodide: PyodideInterface, source: string): string[] {
  return pyodide.pyodide_py.ffi._pyodide._base
    .find_imports(source)
    .toJs() as string[];
}

export async function tryModuleAutoLoad(
  pyodide: PyodideInterface,
  postMessage: PostMessageFn,
  sources: string[],
): Promise<PackageData[]> {
  const importsArr = sources.map((source) => findImports(pyodide, source));
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
    return [];
  }

  const channel = new MessageChannel();

  postMessage(
    {
      type: "event:autoinstall",
    },
    channel.port2,
  );

  try {
    const loadedPackages = await pyodide.loadPackage(packagesToLoad);

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
