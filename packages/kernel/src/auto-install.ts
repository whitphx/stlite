import { PackageData, PyodideInterface } from "pyodide";
import { OutMessage, AutoInstallMessage } from "./types";

export async function tryAutoInstall(
  pyodide: PyodideInterface,
  sources: string[],
  postMessage: (message: OutMessage, port: MessagePort) => void
): Promise<PackageData[]> {
  const channel = new MessageChannel();

  postMessage(
    {
      type: "event:autoinstall",
    },
    channel.port2
  );

  try {
    const loadedPackagesArr = await Promise.all(
      sources.map((source) => pyodide.loadPackagesFromImports(source))
    );
    const loadedPackages = loadedPackagesArr.flat();

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
