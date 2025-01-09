import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ToastContainer } from "@stlite/common-react";

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement,
);
