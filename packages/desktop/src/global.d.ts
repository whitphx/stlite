import type { NodeJsWorkerAPI } from "../electron/preload";

export declare global {
  interface Window {
    archives: {
      readSitePackagesSnapshot: () => Promise<Uint8Array>;
      readRequirements: () => Promise<string[]>;
      readStreamlitAppDirectory: () => Promise<Record<string, Buffer>>;
    };
    nodeJsWorkerAPI: NodeJsWorkerAPI;
  }
}
