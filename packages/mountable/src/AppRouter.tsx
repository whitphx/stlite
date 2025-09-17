import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StreamlitApp from "./StreamlitApp";
import DuneApp from "./dune/DuneApp";
import { StliteKernel } from "@stlite/kernel";

export interface AppRouterProps {
  kernel?: StliteKernel;
  mode?: "streamlit" | "dune" | "auto";
}

function AppRouter(props: AppRouterProps) {
  const { kernel, mode = "auto" } = props;

  // If mode is explicitly set, render that component directly
  if (mode === "streamlit" && kernel) {
    return <StreamlitApp kernel={kernel} />;
  }

  if (mode === "dune") {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/dune/development/:port" element={<DuneApp />} />
          <Route path="/dune/:appId" element={<DuneApp />} />
          <Route
            path="/dune"
            element={<div>Please provide an appId in the URL</div>}
          />
          <Route path="*" element={<Navigate to="/dune" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // Auto mode: Detect based on URL or other conditions
  const pathname = window.location.pathname;
  const isDunePath = pathname.includes("/dune");

  if (isDunePath) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/dune/development/:port" element={<DuneApp />} />
          <Route path="/dune/:appId" element={<DuneApp />} />
          <Route
            path="/dune"
            element={<div>Please provide an appId in the URL</div>}
          />
          <Route path="*" element={<Navigate to="/dune" />} />
        </Routes>
      </BrowserRouter>
    );
  }

  // Default to Streamlit for backward compatibility
  if (!kernel) {
    console.error("Kernel is required for Streamlit mode");
    return <div>Error: No kernel provided for Streamlit app</div>;
  }

  return <StreamlitApp kernel={kernel} />;
}

export default AppRouter;
