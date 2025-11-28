import { StliteKernel, type StliteKernelOptions } from "@stlite/kernel";

export function createKernel(kernelOptions: StliteKernelOptions) {
  return new StliteKernel(kernelOptions);
}
