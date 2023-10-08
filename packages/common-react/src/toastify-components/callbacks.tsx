import React from "react";
import { StliteKernelOptions } from "@stlite/kernel";
import { toast, Slide, Id as ToastId } from "react-toastify";
import ErrorToastContent from "./ErrorToastContent";

interface ToastKernelCallbacks {
  onProgress: StliteKernelOptions["onProgress"];
  onLoad: StliteKernelOptions["onLoad"];
  onError: StliteKernelOptions["onError"];
}
export function makeToastKernelCallbacks(): ToastKernelCallbacks {
  let prevToastId: ToastId | null = null;
  const toastIds: ToastId[] = [];
  const onProgress: StliteKernelOptions["onProgress"] = (message) => {
    const id = toast(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
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
  const onLoad: StliteKernelOptions["onLoad"] = () => {
    toastIds.forEach((id) => toast.dismiss(id));
  };
  const onError: StliteKernelOptions["onError"] = (error) => {
    toast(
      <ErrorToastContent message="Error during booting up" error={error} />,
      {
        position: toast.POSITION.BOTTOM_RIGHT,
        type: "error",
        autoClose: false,
        closeOnClick: false,
      }
    );
  };

  return {
    onProgress,
    onLoad,
    onError,
  };
}
