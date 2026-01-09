import { toast, ToastOptions, ToastPromiseParams } from "react-toastify";
import ErrorToastContent from "./ErrorToastContent";

export function stliteStyledPromiseToast<
  TData = unknown,
  TError extends Error | undefined = undefined,
  TPending = unknown,
>(
  promise: Promise<TData>,
  messages: ToastPromiseParams<TData, TError, TPending>,
  options?: ToastOptions<TData>,
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
                  errorMessage
                );
              },
              autoClose: false,
              closeOnClick: false,
            }
          : errorMessage,
    },
    {
      ...options,
      hideProgressBar: true,
      position: "bottom-right",
    },
  );
}
