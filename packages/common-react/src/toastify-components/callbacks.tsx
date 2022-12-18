import { StliteKernelOptions } from "@stlite/kernel";
import { toast, Slide, Id as ToastId } from "react-toastify";

interface ToastKernelCallbacks {
  onProgress: StliteKernelOptions["onProgress"];
  onLoad: StliteKernelOptions["onLoad"];
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

  return {
    onProgress,
    onLoad,
  };
}
