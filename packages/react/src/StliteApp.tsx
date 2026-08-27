import log from "loglevel";
import type { StliteKernel } from "@stlite/kernel";
import { StliteKernelProvider } from "@stlite/kernel/contexts";
import StliteThemedApp from "./StliteThemedApp";

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
      <StliteThemedApp
        styleNonce={props.styleNonce}
        streamlitExecutionStartedAt={streamlitExecutionStartedAt}
        disableDocumentStyles={props.disableDocumentStyles}
      />
    </StliteKernelProvider>
  );
}

export default StliteApp;
