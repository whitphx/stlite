import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./global.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./Root";
import App, { loader as appLoader } from "./App";
import reportWebVitals from "./reportWebVitals";

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: "*",
        index: true,
        loader: appLoader,
        element: <App />,
      },
    ],
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
