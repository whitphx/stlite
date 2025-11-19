import log from "loglevel";
import { type StliteKernel, StliteKernelProvider } from "@stlite/kernel";
import ThemedApp from "@streamlit/app/src/ThemedApp";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";

const engine = new Styletron({ prefix: "st-" });
if (import.meta.env.MODE === "development") {
  // By default, loglevel only shows warnings and errors.
  log.setLevel(log.levels.DEBUG);
}

const streamlitExecutionStartedAt = Date.now();

export interface StreamlitAppProps {
  kernel: StliteKernel;
}
function StreamlitApp(props: StreamlitAppProps) {
  return (
    <StliteKernelProvider kernel={props.kernel}>
      <StyletronProvider value={engine}>
        <ThemedApp streamlitExecutionStartedAt={streamlitExecutionStartedAt} />
      </StyletronProvider>
    </StliteKernelProvider>
  );
}

export default StreamlitApp;
