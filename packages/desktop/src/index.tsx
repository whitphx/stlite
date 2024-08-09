import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ToastContainer } from "@stlite/common-react";
import "react-toastify/dist/ReactToastify.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>,
);
