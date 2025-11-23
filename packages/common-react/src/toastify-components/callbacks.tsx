import type { StliteKernelEventListener } from "@stlite/kernel";
import { toast, Slide, Id as ToastId } from "react-toastify";
import ErrorToastContent from "./ErrorToastContent";
import { stliteStyledPromiseToast } from "./promise";

export interface ToastKernelCallbacks {
  onLoadProgress: StliteKernelEventListener<"loadProgress">;
  onLoadFinished: StliteKernelEventListener<"loadFinished">;
  onLoadError: StliteKernelEventListener<"loadError">;
  onModuleAutoLoad: StliteKernelEventListener<"moduleAutoLoad">;
}
export function makeToastKernelEventListeners(): ToastKernelCallbacks {
  let prevToastId: ToastId | null = null;
  const toastIds: ToastId[] = [];
  const onLoadProgress: StliteKernelEventListener<"loadProgress"> = (e) => {
    const id = toast(e.detail, {
      position: "bottom-right",
      transition: Slide,
      isLoading: true,
      hideProgressBar: true,
      closeButton: false,
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
      },
    );
  };
  const onModuleAutoLoad: StliteKernelEventListener<"moduleAutoLoad"> = (e) => {
    const { installPromise } = e.detail;
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

  return {
    onLoadProgress,
    onLoadFinished,
    onLoadError,
    onModuleAutoLoad,
  };
}
