import React from "react";

import ThemedApp from "streamlit-browser/src/ThemedApp";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
const engine = new Styletron({ prefix: "st-" });

export interface AppProps {
  mainScriptData: string;
}
function App(props: AppProps) {
  return (
    <StyletronProvider value={engine}>
      <ThemedApp stliteMainScriptData={props.mainScriptData} />
    </StyletronProvider>
  );
}

export default App;
