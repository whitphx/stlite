export declare global {
  interface Window {
    archives: {
      readSitePackagesSnapshot: () => Promise<Uint8Array>;
    };
  }
}
