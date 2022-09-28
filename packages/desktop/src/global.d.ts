export declare global {
  interface Window {
    snapshot: {
      read: () => Promise<Uint8Array>;
    };
  }
}
