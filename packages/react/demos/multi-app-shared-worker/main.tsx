import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const reactRoot = createRoot(document.getElementById("root") as HTMLElement);

reactRoot.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
