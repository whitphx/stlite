import type { StliteKernelEventListener } from "@stlite/kernel";
import { toast, Slide, Id } from "react-toastify";
import ErrorToastContent from "./ErrorToastContent";
import { stliteStyledPromiseToast } from "./promise";

export interface ToastKernelCallbacks {
  onLoadProgress: StliteKernelEventListener<"loadProgress">;
  onLoadFinished: StliteKernelEventListener<"loadFinished">;
  onLoadError: StliteKernelEventListener<"loadError">;
  onModuleAutoLoad: StliteKernelEventListener<"moduleAutoLoad">;
  onInstall: StliteKernelEventListener<"install">;
  onWriteFile: StliteKernelEventListener<"writeFile">;
  onRenameFile: StliteKernelEventListener<"renameFile">;
  onUnlink: StliteKernelEventListener<"unlink">;
  onReadFile: StliteKernelEventListener<"readFile">;
  onReboot: StliteKernelEventListener<"reboot">;
}
export function makeToastKernelEventListeners(
  toastContainerId: Id,
): ToastKernelCallbacks {
  let prevToastId: Id | null = null;
  const toastIds: Id[] = [];

  const onLoadProgress: StliteKernelEventListener<"loadProgress"> = (e) => {
    const id = toast(e.detail, {
      position: "bottom-right",
      transition: Slide,
      isLoading: true,
      hideProgressBar: true,
      closeButton: false,
      containerId: toastContainerId,
    });
    toastIds.push(id);

    if (prevToastId) {
      toast.update(prevToastId, {
        isLoading: false,
        autoClose: 3000,
      });
    }
    prevToastId = id;
  };
  const onLoadFinished: StliteKernelEventListener<"loadFinished"> = () => {
    toastIds.forEach((id) => toast.dismiss(id));
  };
  const onLoadError: StliteKernelEventListener<"loadError"> = (e) => {
    toast(
      <ErrorToastContent message="Error during booting up" error={e.detail} />,
      {
        position: "bottom-right",
        type: "error",
        autoClose: false,
        closeOnClick: false,
        containerId: toastContainerId,
      },
    );
  };
  const onModuleAutoLoad: StliteKernelEventListener<"moduleAutoLoad"> = (e) => {
    const { promise } = e.detail;
    stliteStyledPromiseToast(
      promise,
      {
        success: {
          render({ data }) {
            return `Auto-loaded${
              data ? ": " + data.map((pkg) => pkg.name).join(", ") : " packages"
            }`;
          },
        },
        error: "Failed to auto-load packages",
        pending: "Auto-loading packages",
      },
      {
        containerId: toastContainerId,
      },
    );
  };
  const onInstall: StliteKernelEventListener<"install"> = (e) => {
    const { requirements, promise } = e.detail;
    stliteStyledPromiseToast<void>(
      promise,
      {
        pending: "Installing",
        success: `Successfully installed: ${requirements.join(", ")}`,
        error: `Failed to install: ${requirements.join(", ")}`,
      },
      {
        containerId: toastContainerId,
      },
    );
  };
  const onWriteFile: StliteKernelEventListener<"writeFile"> = (e) => {
    const { path, promise } = e.detail;
    stliteStyledPromiseToast<void>(
      promise,
      {
        error: `Failed to write file: ${path}`,
      },
      {
        containerId: toastContainerId,
      },
    );
  };
  const onRenameFile: StliteKernelEventListener<"renameFile"> = (e) => {
    const { oldPath, newPath, promise } = e.detail;
    stliteStyledPromiseToast<void>(
      promise,
      {
        error: `Failed to rename file from ${oldPath} to ${newPath}`,
      },
      {
        containerId: toastContainerId,
      },
    );
  };
  const onUnlink: StliteKernelEventListener<"unlink"> = (e) => {
    const { path, promise } = e.detail;
    stliteStyledPromiseToast<void>(
      promise,
      {
        error: `Failed to unlink: ${path}`,
      },
      {
        containerId: toastContainerId,
      },
    );
  };
  const onReadFile: StliteKernelEventListener<"readFile"> = (e) => {
    const { path, promise } = e.detail;
    stliteStyledPromiseToast<string | Uint8Array>(
      promise,
      {
        error: `Failed to read file: ${path}`,
      },
      {
        containerId: toastContainerId,
      },
    );
  };
  const onReboot: StliteKernelEventListener<"reboot"> = (e) => {
    const { promise } = e.detail;
    stliteStyledPromiseToast<void>(
      promise,
      {
        pending: "Rebooting",
        success: "Successfully rebooted",
        error: "Failed to reboot",
      },
      {
        containerId: toastContainerId,
      },
    );
  };

  return {
    onLoadProgress,
    onLoadFinished,
    onLoadError,
    onModuleAutoLoad,
    onInstall,
    onWriteFile,
    onRenameFile,
    onUnlink,
    onReadFile,
    onReboot,
  };
}
