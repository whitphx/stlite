import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

export interface MountOptions {
  mainScriptData: string;
  container?: HTMLElement;
}
function mount(options: MountOptions) {
  const container = options.container || document.body;
  ReactDOM.render(
    <React.StrictMode>
      <App mainScriptData={options.mainScriptData} />
    </React.StrictMode>,
    container
  );
}

// Sample:
mount({
  mainScriptData: `import streamlit as st

st.write("Hello World")`,
});

