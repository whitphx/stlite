import React from "react";

import { StliteKernel, StliteKernelProvider } from "@stlite/kernel";

import ThemedApp from "streamlit-browser/src/ThemedApp";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
const engine = new Styletron({ prefix: "st-" });

export interface StreamlitAppProps {
  kernel: StliteKernel;
}
function StreamlitApp(props: StreamlitAppProps) {
  return (
    <StliteKernelProvider kernel={props.kernel}>
      <StyletronProvider value={engine}>
        <ThemedApp />
      </StyletronProvider>
    </StliteKernelProvider>
  );
}

export default StreamlitApp;
