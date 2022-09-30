export declare global {
  interface Window {
    archives: {
      readSitePackagesSnapshot: () => Promise<Uint8Array>;
      readStreamlitAppDirectory: () => Promise<Record<string, Buffer>>;
    };
  }
}
