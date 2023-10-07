export function makeToastKernelCallbacks() {
  return {
    onError: jest.fn(),
    onLoad: jest.fn(),
    onProgress: jest.fn(),
  };
}
