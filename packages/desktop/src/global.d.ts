export declare global {
  interface Window {
    snapshot: {
      read: () => Uint8Array;
    };
  }
}
