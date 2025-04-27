import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
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
