import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ToastContainer } from "@stlite/common-react";

const rootDomNode = document.getElementById("root");

if (!rootDomNode) {
  throw new Error("#root DOM element not found");
}

const reactRoot = createRoot(rootDomNode);

reactRoot.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
