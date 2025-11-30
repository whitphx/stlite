import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const rootDomNode = document.getElementById("root");

if (!rootDomNode) {
  throw new Error("#root DOM element not found");
}

const reactRoot = createRoot(rootDomNode);

reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
