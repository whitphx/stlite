import log from "loglevel";
import type { StliteKernelOptions } from "@stlite/kernel";
import { StliteKernel, StliteKernelProvider } from "@stlite/kernel";
import ThemedApp from "@streamlit/app/src/ThemedApp";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
import React, { useEffect, useImperativeHandle, useMemo } from "react";

const engine = new Styletron({ prefix: "st-" });
if (process.env.NODE_ENV === "development") {
  // By default, loglevel only shows warnings and errors.
  log.setLevel(log.levels.DEBUG);
}

const streamlitExecutionStartedAt = Date.now();

export interface StreamlitAppProps {
  kernelOptions: StliteKernelOptions;
}
export interface StreamlitAppRef {
  install: StliteKernel["install"];
  writeFile: StliteKernel["writeFile"];
  renameFile: StliteKernel["renameFile"];
  unlink: StliteKernel["unlink"];
  readFile: StliteKernel["readFile"];
  getCodeCompletion: StliteKernel["getCodeCompletion"];
}
const StreamlitApp = React.forwardRef<StreamlitAppRef, StreamlitAppProps>(
  (props, ref) => {
    const kernel = useMemo<StliteKernel>(() => {
      return new StliteKernel(props.kernelOptions);
    }, [props.kernelOptions]);

    useEffect(() => {
      return () => {
        kernel.dispose();
      };
    }, [kernel]);

    useImperativeHandle(
      ref,
      () => ({
        install: (requirements, options?) => {
          return kernel.install(requirements, options);
        },
        writeFile: (path, data) => {
          return kernel.writeFile(path, data);
        },
        renameFile: (oldPath, newPath) => {
          return kernel.renameFile(oldPath, newPath);
        },
        unlink: (path) => {
          return kernel.unlink(path);
        },
        readFile: (path, opts?) => {
          return kernel.readFile(path, opts);
        },
        getCodeCompletion: (code, options) => {
          return kernel.getCodeCompletion(code, options);
        },
      }),
      [kernel],
    );

    return (
      <StliteKernelProvider kernel={kernel}>
        <StyletronProvider value={engine}>
          <ThemedApp
            streamlitExecutionStartedAt={streamlitExecutionStartedAt}
          />
        </StyletronProvider>
      </StliteKernelProvider>
    );
  },
);

StreamlitApp.displayName = "StreamlitApp";

export default StreamlitApp;
