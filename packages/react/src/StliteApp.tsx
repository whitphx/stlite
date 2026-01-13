import log from "loglevel";
import type { StliteKernel } from "@stlite/kernel";
import { StliteKernelProvider } from "@stlite/kernel/contexts";
import StliteThemedApp from "./StliteThemedApp";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";

const engine = new Styletron({ prefix: "st-" });
if (process.env.NODE_ENV === "development") {
  // By default, loglevel only shows warnings and errors.
  log.setLevel(log.levels.DEBUG);
}

const streamlitExecutionStartedAt = Date.now();

export interface StliteAppProps {
  kernel: StliteKernel;
  styleNonce?: string;
  disableDocumentStyles?: boolean;
}
function StliteApp(props: StliteAppProps) {
  return (
    <StliteKernelProvider kernel={props.kernel}>
      <StyletronProvider value={engine}>
        <StliteThemedApp
          styleNonce={props.styleNonce}
          streamlitExecutionStartedAt={streamlitExecutionStartedAt}
          disableDocumentStyles={props.disableDocumentStyles}
        />
      </StyletronProvider>
    </StliteKernelProvider>
  );
}

export default StliteApp;
