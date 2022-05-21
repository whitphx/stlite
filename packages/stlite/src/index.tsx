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
