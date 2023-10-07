const onError = jest.fn();
const onLoad = jest.fn();
const onProgress = jest.fn();

export function makeToastKernelCallbacks() {
  return {
    onError,
    onLoad,
    onProgress,
  };
}
