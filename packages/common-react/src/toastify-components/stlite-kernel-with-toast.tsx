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
): ReturnType<typeof toast.promise<TData, TError, TPending>> {
  const errorMessage = messages.error;
  return toast.promise(
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
      position: "bottom-right",
    },
  );
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

  public writeFile(...args: Parameters<StliteKernel["writeFile"]>) {
    return stliteStyledPromiseToast<void>(this.kernel.writeFile(...args), {
      error: "Failed to write the file",
    });
  }

  public renameFile(...args: Parameters<StliteKernel["renameFile"]>) {
    return stliteStyledPromiseToast<void>(this.kernel.renameFile(...args), {
      error: "Failed to rename the file",
    });
  }

  public unlink(...args: Parameters<StliteKernel["unlink"]>) {
    return stliteStyledPromiseToast<void>(this.kernel.unlink(...args), {
      error: "Failed to remove the file",
    });
  }

  public readFile(...args: Parameters<StliteKernel["readFile"]>) {
    return stliteStyledPromiseToast<string | Uint8Array>(
      this.kernel.readFile(...args),
      {
        error: "Failed to read the file",
      },
    );
  }

  public install(...args: Parameters<StliteKernel["install"]>) {
    return stliteStyledPromiseToast<void>(this.kernel.install(...args), {
      pending: "Installing",
      success: "Successfully installed",
      error: "Failed to install",
    });
  }

  public reboot(...args: Parameters<StliteKernel["reboot"]>) {
    return stliteStyledPromiseToast<void>(this.kernel.reboot(...args), {
      pending: "Rebooting",
      success: "Successfully rebooted",
      error: "Failed to reboot",
    });
  }
}
