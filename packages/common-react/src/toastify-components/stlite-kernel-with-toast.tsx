import type { StliteKernel } from "@stlite/kernel";
import { stliteStyledPromiseToast } from "./promise";

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
