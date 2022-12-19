import React from "react";
import { ToastContainer as DefaultToastContainer } from "react-toastify";
import { isDarkTheme } from "./theme";

function ToastContainer() {
  return (
    <DefaultToastContainer
      style={{ zIndex: 999999 }}
      theme={isDarkTheme() ? "dark" : "light"}
    />
  );
}

export default ToastContainer;
