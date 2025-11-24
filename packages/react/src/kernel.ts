import { StliteKernel, type StliteKernelOptions } from "@stlite/kernel";

export function createKernel(kernelOptions: StliteKernelOptions) {
  return new StliteKernel({
    ...kernelOptions,
    workerType: kernelOptions.workerType ?? "module", // Default value is "module" because Vite loads the worker scripts as ES modules without bundling at dev time, so we need to specify the type as "module" for the "import" statements in the worker script to work.
  });
}
