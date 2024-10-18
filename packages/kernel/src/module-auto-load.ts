import type { PyodideInterface } from "pyodide";
import type { ModuleAutoLoadMessage, OutMessage } from "./types";
import type { PostMessageFn } from "./worker-runtime";

export async function tryModuleAutoLoad(
  pyodide: PyodideInterface,
  postMessage: PostMessageFn,
  sources: string[],
): Promise<void> {
  if (sources.length === 0) {
    return;
  }

  const channel = new MessageChannel();

  postMessage(
    {
      type: "event:moduleAutoLoad",
    } satisfies OutMessage,
    channel.port2,
  );

  try {
    const loadedPackagesArr = await Promise.all(
      sources.map((source) => pyodide.loadPackagesFromImports(source)),
    );
    const loadedPackages = Array.from(new Set(loadedPackagesArr.flat()));

    channel.port1.postMessage({
      type: "moduleAutoLoad:success",
      data: {
        loadedPackages,
      },
    } satisfies ModuleAutoLoadMessage);
  } catch (error) {
    channel.port1.postMessage({
      type: "moduleAutoLoad:error",
      error: error as Error,
    } satisfies ModuleAutoLoadMessage);
    throw error;
  } finally {
    channel.port1.close();
  }
}
