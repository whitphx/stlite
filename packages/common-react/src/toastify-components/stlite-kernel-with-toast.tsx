import React from "react";
import { StliteKernel } from "@stlite/kernel";
import { toast } from "react-toastify";
import ErrorToastContent from "./ErrorToastContent";

export class StliteKernelWithToast {
  constructor(private kernel: StliteKernel) {}

  public writeFile(...args: Parameters<StliteKernel["writeFile"]>) {
    return toast.promise<void, Error>(
      this.kernel.writeFile(...args),
      {
        error: "Failed to write the file",
      },
      {
        hideProgressBar: true,
        position: toast.POSITION.BOTTOM_RIGHT,
      }
    );
  }

  public renameFile(...args: Parameters<StliteKernel["renameFile"]>) {
    return toast.promise<void, Error>(
      this.kernel.renameFile(...args),
      {
        error: "Failed to rename the file",
      },
      {
        hideProgressBar: true,
        position: toast.POSITION.BOTTOM_RIGHT,
      }
    );
  }

  public unlink(...args: Parameters<StliteKernel["unlink"]>) {
    return toast.promise<void, Error>(
      this.kernel.unlink(...args),
      {
        error: "Failed to remove the file",
      },
      {
        hideProgressBar: true,
        position: toast.POSITION.BOTTOM_RIGHT,
      }
    );
  }

  public install(...args: Parameters<StliteKernel["install"]>) {
    return toast.promise<void, Error>(
      this.kernel.install(...args),
      {
        pending: "Installing",
        success: "Successfully installed",
        error: {
          render({ data }) {
            return (
              <ErrorToastContent message="Failed to install" error={data} />
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
}
