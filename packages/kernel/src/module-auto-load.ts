import type { PyodideInterface } from "pyodide";
import type { PyProxy } from "pyodide/ffi";
import type { ModuleAutoLoadMessage } from "./types";
import type { PostMessageFn } from "./worker-runtime";

let findImportsPyFn: ((source: string) => PyProxy) | undefined;
export function findImports(
  pyodide: PyodideInterface,
  source: string
): Set<string> {
  if (!findImportsPyFn) {
    // Ref: https://github.com/pyodide/pyodide/blob/10b484cfe427e076c929a55dc35cfff01ea8d3bc/src/py/_pyodide/_base.py#L586
    const pyCode = `
import ast
from textwrap import dedent

def find_imports(source: str) -> list[str]:
    source = dedent(source)

    try:
        mod = ast.parse(source)
    except SyntaxError:
        return []
    imports = set()
    for node in mod.body:
        if isinstance(node, ast.Import):
            for name in node.names:
                node_name = name.name
                imports.add(node_name.split(".")[0])
        elif isinstance(node, ast.ImportFrom):
            module_name = node.module
            if module_name is None:
                continue
            imports.add(module_name.split(".")[0])
    return imports
`;
    pyodide.runPython(pyCode);
    findImportsPyFn = pyodide.globals.get("find_imports") as (
      source: string
    ) => PyProxy;
  }
  return findImportsPyFn(source).toJs();
}

export function unionSets<T>(sets: Set<T>[]): Set<T> {
  const union = new Set<T>();
  for (const set of sets) {
    for (const item of set) {
      union.add(item);
    }
  }
  return union;
}

export async function tryModuleAutoLoad(
  pyodide: PyodideInterface,
  postMessage: PostMessageFn,
  sources: string[]
): Promise<void> {
  // Ref: `pyodide.loadPackagesFromImports` (https://github.com/pyodide/pyodide/blob/0.26.0/src/js/api.ts#L191)

  const importsArr = sources.map((source) => findImports(pyodide, source));
  const importsSet = unionSets(importsArr);
  const imports = Array.from(importsSet);

  const notFoundImports = imports.filter(
    (name) =>
      !pyodide.runPython(`__import__('importlib').util.find_spec('${name}')`)
  );

  const packagesToLoad = notFoundImports
    .map((name) =>
      (
        pyodide as unknown as {
          _api: { _import_name_to_package_name: Map<string, string> };
        }
      )._api._import_name_to_package_name.get(name)
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
    channel.port2
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
