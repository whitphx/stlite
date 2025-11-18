import React, { useMemo, useRef, useImperativeHandle } from "react";
import type { StliteKernelOptions } from "@stlite/kernel";
import {
  ToastContainer,
  makeToastKernelCallbacks,
  stliteStyledPromiseToast,
  type MakeToastKernelCallbacksOptions,
} from "@stlite/common-react";
import StreamlitApp, { StreamlitAppRef } from "./StreamlitApp";

export interface StreamlitAppWithToastProps {
  kernelOptions: StliteKernelOptions;
  toastCallbackOptions?: MakeToastKernelCallbacksOptions;
}
export type StreamlitAppWithToastRef = StreamlitAppRef;
const StreamlitAppWithToast = React.forwardRef<
  StreamlitAppWithToastRef,
  StreamlitAppWithToastProps
>(({ kernelOptions, toastCallbackOptions }, ref) => {
  const toastCallbacks = useMemo(
    () => makeToastKernelCallbacks(toastCallbackOptions),
    [toastCallbackOptions],
  );

  const useInnerRef = useRef<StreamlitAppRef>(null);
  useImperativeHandle(ref, () => {
    const getInnerRef = () => {
      if (useInnerRef.current == null) {
        throw new Error("StreamlitApp is not mounted yet");
      }
      return useInnerRef.current;
    };

    return {
      install: (requirements, options) => {
        return stliteStyledPromiseToast(
          getInnerRef().install(requirements, options),
          {
            pending: "Installing",
            success: "Successfully installed",
            error: "Failed to install",
          },
        );
      },
      writeFile: (path, data) => {
        return stliteStyledPromiseToast(getInnerRef().writeFile(path, data), {
          error: `Failed to write file: ${path}`,
        });
      },
      renameFile: (oldPath, newPath) => {
        return stliteStyledPromiseToast(
          getInnerRef().renameFile(oldPath, newPath),
          {
            error: `Failed to rename file: ${oldPath} to ${newPath}`,
          },
        );
      },
      unlink: (path) => {
        return stliteStyledPromiseToast(getInnerRef().unlink(path), {
          error: `Failed to unlink file: ${path}`,
        });
      },
      readFile: (path, opts) => {
        return stliteStyledPromiseToast(getInnerRef().readFile(path, opts), {
          error: `Failed to read file: ${path}`,
        });
      },
      getCodeCompletion: getInnerRef().getCodeCompletion,
    };
  }, [useInnerRef]);

  return (
    <>
      <StreamlitApp
        ref={useInnerRef}
        kernelOptions={{
          ...kernelOptions,
          ...toastCallbacks,
        }}
      />
      <ToastContainer />
    </>
  );
});

StreamlitAppWithToast.displayName = "StreamlitAppWithToast";

export default StreamlitAppWithToast;
