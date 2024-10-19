import type { PyodideInterface } from "pyodide";
import type { ModuleAutoLoadMessage } from "./types";
import type { PostMessageFn } from "./worker-runtime";

export async function tryModuleAutoLoad(
  pyodide: PyodideInterface,
  postMessage: PostMessageFn,
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
    return;
  }

  const channel = new MessageChannel();

  postMessage(
    {
      type: "event:moduleAutoLoad",
      data: {
        packagesToLoad,
      },
    },
    channel.port2,
  );

  try {
    const loadedPackages = await pyodide.loadPackage(packagesToLoad);

    channel.port1.postMessage({
      type: "moduleAutoLoad:success",
      data: {
        loadedPackages,
      },
    } as ModuleAutoLoadMessage);
    channel.port1.close();
    return;
  } catch (error) {
    channel.port1.postMessage({
      type: "moduleAutoLoad:error",
      error: error as Error,
    } as ModuleAutoLoadMessage);
    channel.port1.close();
    throw error;
  }
}
