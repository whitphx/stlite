import React from "react";
import { StliteKernel } from "@stlite/kernel";
import { toast } from "react-toastify";
import ErrorToastContent from "./ErrorToastContent";

type ToastPromiseParams<TData> = Parameters<typeof toast.promise<TData>>;
type ToastPromiseMessages<TData> = Partial<
  Record<keyof ToastPromiseParams<TData>[1], string>
>;
type ToastPromiseReturnType = ReturnType<typeof toast.promise>;
function stliteStyledPromiseToast<TData>(
  promise: ToastPromiseParams<TData>[0],
  messages: ToastPromiseMessages<TData>
): ToastPromiseReturnType {
  const errorMessage = messages.error;
  return toast.promise<TData, Error>(
    promise,
    {
      pending: messages.pending,
      success: messages.success,
      error: errorMessage && {
        render({ data }) {
          return data ? (
            <ErrorToastContent message={errorMessage} error={data} />
          ) : (
            messages.error
          );
        },
        autoClose: false,
        closeOnClick: false,
      },
    },
    {
      hideProgressBar: true,
      position: toast.POSITION.BOTTOM_RIGHT,
    }
  );
}

export class StliteKernelWithToast {
  constructor(private kernel: StliteKernel) {}

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

  public install(...args: Parameters<StliteKernel["install"]>) {
    return stliteStyledPromiseToast<void>(this.kernel.install(...args), {
      pending: "Installing",
      success: "Successfully installed",
      error: "Failed to install",
    });
  }
}
