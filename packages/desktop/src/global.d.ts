import type { AppConfig } from "../electron/preload";

export declare global {
  interface Window {
    appConfig: AppConfig;
    archives: {
      readSitePackagesSnapshot: () => Promise<Uint8Array>;
      readRequirements: () => Promise<string[]>;
      readStreamlitAppDirectory: () => Promise<Record<string, Buffer>>;
    };
  }
}
