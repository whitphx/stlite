export declare global {
  interface Window {
    localWheelFiles: {
      read: (filePath: string) => Uint8Array;
    };
  }
}
