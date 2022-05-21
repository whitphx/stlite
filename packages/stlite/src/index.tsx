import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

export interface MountOptions {
  container?: HTMLElement;
}

export function mount(code: string, options?: MountOptions) {
  const container = options?.container || document.body;
  ReactDOM.render(
    <React.StrictMode>
      <App mainScriptData={code} />
    </React.StrictMode>,
    container
  );
}

if (process.env.NODE_ENV === "development") {
  mount(`import streamlit as st

st.write("Hello World")`);
}
