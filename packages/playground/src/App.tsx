import { useState } from "react";
import "./App.css";

import EditorModal from "./EditorModal";

import ThemedApp from "streamlit-browser/src/ThemedApp";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
const engine = new Styletron({ prefix: "st-" });

const DEFAULT_VALUE = `import streamlit as st

name = st.text_input("Name")
st.write("Hello ", name or "world")`;

function App() {
  const [mainScriptData, setMainScriptData] = useState(DEFAULT_VALUE);

  return (
    <>
      <EditorModal defaultValue={mainScriptData} onChange={setMainScriptData} />
      <StyletronProvider value={engine}>
        <ThemedApp stliteMainScriptData={mainScriptData} />
      </StyletronProvider>
    </>
  );
}

export default App;
