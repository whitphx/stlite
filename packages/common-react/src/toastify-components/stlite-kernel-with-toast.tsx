import React from "react";
import type { StliteKernel, StliteKernelOptions } from "@stlite/kernel";
import { toast, ToastPromiseParams } from "react-toastify";
import ErrorToastContent from "./ErrorToastContent";

function stliteStyledPromiseToast<
  TData = unknown,
  TError extends Error | undefined = undefined,
  TPending = unknown,
>(
  promise: Promise<TData>,
  messages: ToastPromiseParams<TData, TError, TPending>,
): Promise<TData> {
  const errorMessage = messages.error;
  toast.promise<TData, TError, TPending>(
    promise,
    {
      pending: messages.pending,
      success: messages.success,
      error:
        typeof errorMessage === "string"
          ? {
              render({ data }) {
                return data ? (
                  <ErrorToastContent message={errorMessage} error={data} />
                ) : (
                  <>messages.error</>
                );
              },
              autoClose: false,
              closeOnClick: false,
            }
          : errorMessage,
    },
    {
      hideProgressBar: true,
      position: toast.POSITION.BOTTOM_RIGHT,
    },
  );
  return promise;
}

export interface StliteKernelWithToastOptions {
  onModuleAutoLoad?: StliteKernelOptions["onModuleAutoLoad"];
}
export class StliteKernelWithToast {
  constructor(
    private kernel: StliteKernel,
    options?: StliteKernelWithToastOptions,
  ) {
    kernel.onModuleAutoLoad = (packagesToLoad, installPromise) => {
      if (options?.onModuleAutoLoad) {
        options.onModuleAutoLoad(packagesToLoad, installPromise);
      }

      stliteStyledPromiseToast(installPromise, {
        success: {
          render({ data }) {
            return `Auto-loaded${
              data ? ": " + data.map((pkg) => pkg.name).join(", ") : " packages"
            }`;
          },
        },
        error: "Failed to auto-load packages",
        pending: "Auto-loading packages",
      });
    };
  }

  public writeFile(
    ...args: Parameters<StliteKernel["writeFile"]>
  ): Promise<void> {
    return stliteStyledPromiseToast<void, Error>(
      this.kernel.writeFile(...args),
      {
        error: "Failed to write the file",
      },
    );
  }

  public renameFile(
    ...args: Parameters<StliteKernel["renameFile"]>
  ): Promise<void> {
    return stliteStyledPromiseToast<void, Error>(
      this.kernel.renameFile(...args),
      {
        error: "Failed to rename the file",
      },
    );
  }

  public unlink(...args: Parameters<StliteKernel["unlink"]>): Promise<void> {
    return stliteStyledPromiseToast<void, Error>(this.kernel.unlink(...args), {
      error: "Failed to remove the file",
    });
  }

  public readFile(
    ...args: Parameters<StliteKernel["readFile"]>
  ): Promise<string | Uint8Array> {
    return stliteStyledPromiseToast<string | Uint8Array, Error>(
      this.kernel.readFile(...args),
      {
        error: "Failed to read the file",
      },
    );
  }

  public install(...args: Parameters<StliteKernel["install"]>): Promise<void> {
    return stliteStyledPromiseToast<void, Error>(this.kernel.install(...args), {
      pending: "Installing",
      success: "Successfully installed",
      error: "Failed to install",
    });
  }

  public reboot(...args: Parameters<StliteKernel["reboot"]>): Promise<void> {
    return stliteStyledPromiseToast<void, Error>(this.kernel.reboot(...args), {
      pending: "Rebooting",
      success: "Successfully rebooted",
      error: "Failed to reboot",
    });
  }
}
