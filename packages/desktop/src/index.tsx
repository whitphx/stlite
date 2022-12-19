import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ToastContainer } from "@stlite/common-react";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);
