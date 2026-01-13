import { useEffect, useMemo, useId } from "react";
import type { StliteKernel } from "@stlite/kernel";
import StliteApp from "./StliteApp";
import {
  ToastContainer,
  makeToastKernelEventListeners,
} from "./toastify-components";

export interface StliteAppWithToastProps {
  kernel: StliteKernel;
  disableProgressToasts?: boolean;
  disableErrorToasts?: boolean;
  disableModuleAutoLoadToasts?: boolean;
  styleNonce?: string;
  disableDocumentStyles?: boolean;
}

function StliteAppWithToast(props: StliteAppWithToastProps) {
  const {
    kernel,
    disableProgressToasts,
    disableErrorToasts,
    disableModuleAutoLoadToasts,
  } = props;

  const toastContainerId = useId();

  const {
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
  } = useMemo(
    () => makeToastKernelEventListeners(toastContainerId),
    [toastContainerId],
  );

  useEffect(() => {
    if (disableProgressToasts) {
      return;
    }

    kernel.addEventListener("loadProgress", onLoadProgress);
    kernel.addEventListener("loadFinished", onLoadFinished);

    return () => {
      kernel.removeEventListener("loadProgress", onLoadProgress);
      kernel.removeEventListener("loadFinished", onLoadFinished);
    };
  }, [kernel, disableProgressToasts, onLoadProgress, onLoadFinished]);

  useEffect(() => {
    if (disableErrorToasts) {
      return;
    }

    kernel.addEventListener("loadError", onLoadError);

    return () => {
      kernel.removeEventListener("loadError", onLoadError);
    };
  }, [kernel, disableErrorToasts, onLoadError]);

  useEffect(() => {
    if (disableModuleAutoLoadToasts) {
      return;
    }

    kernel.addEventListener("moduleAutoLoad", onModuleAutoLoad);

    return () => {
      kernel.removeEventListener("moduleAutoLoad", onModuleAutoLoad);
    };
  }, [kernel, disableModuleAutoLoadToasts, onModuleAutoLoad]);

  useEffect(() => {
    kernel.addEventListener("install", onInstall);
    kernel.addEventListener("writeFile", onWriteFile);
    kernel.addEventListener("renameFile", onRenameFile);
    kernel.addEventListener("unlink", onUnlink);
    kernel.addEventListener("readFile", onReadFile);
    kernel.addEventListener("reboot", onReboot);

    return () => {
      kernel.removeEventListener("install", onInstall);
      kernel.removeEventListener("writeFile", onWriteFile);
      kernel.removeEventListener("renameFile", onRenameFile);
      kernel.removeEventListener("unlink", onUnlink);
      kernel.removeEventListener("readFile", onReadFile);
      kernel.removeEventListener("reboot", onReboot);
    };
  }, [
    kernel,
    onInstall,
    onWriteFile,
    onRenameFile,
    onUnlink,
    onReadFile,
    onReboot,
  ]);

  return (
    <>
      <StliteApp
        kernel={kernel}
        styleNonce={props.styleNonce}
        disableDocumentStyles={props.disableDocumentStyles}
      />
      <ToastContainer toastContainerId={toastContainerId} />
    </>
  );
}

export default StliteAppWithToast;
