import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "normalize.css";
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

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
