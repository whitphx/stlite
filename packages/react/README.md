# `@stlite/react`

A React component for embedding Stlite (Streamlit in browser) apps.
It wraps the core functionality from [`@stlite/browser`](../browser/README.md).

## Installation

bash
npm install @stlite/react @stlite/browser react react-dom
# or
yarn add @stlite/react @stlite/browser react react-dom
# or
pnpm add @stlite/react @stlite/browser react react-dom


## Usage

tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { StliteApp } from "@stlite/react";
import "@stlite/browser/dist/stlite.css"; // IMPORTANT: Import the CSS file

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StliteApp
      code={`
import streamlit as st

name = st.text_input('Your name')
st.write("Hello,", name or "world")
`}
    />
  </React.StrictMode>,
);


## API Reference

The `StliteApp` component accepts the following props:

- `code?: string`: The Python code of the Streamlit app. If `files` is also provided, this code will be mounted as `"streamlit_app.py"` (or the specified `entrypoint`).
- `files?: Record<string, { data: string; type: "text" }>`: A record of files to be mounted on the Pyodide file system. The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`). The value is an object with `data` (string content) and `type` (`"text"`). For performance, consider memoizing this object if it's dynamically constructed to prevent unnecessary re-mounts.
- `entrypoint?: string`: The path to the entrypoint file (e.g., `"streamlit_app.py"`). If `code` is provided, this defaults to `"streamlit_app.py"`.
- `requirements?: string[]`: A list of Python package names to install (e.g., `["pandas", "numpy"]`). For performance, consider memoizing this array if it's dynamically constructed to prevent unnecessary re-mounts.
- `pyodideUrl?: string`: The URL of the Pyodide distribution.
- `sharedWorker?: boolean`: Whether to use a SharedWorker.
- `disableProgressToasts?: boolean`: Disable progress toasts.
- `disableErrorToasts?: boolean`: Disable error toasts.
- `streamlitConfig?: StreamlitConfig`: An object representing the `config.toml` file. For performance, consider memoizing this object if it's dynamically constructed to prevent unnecessary re-mounts.
- `env?: Record<string, string>`: Environment variables for the Python runtime. For performance, consider memoizing this object if it's dynamically constructed to prevent unnecessary re-mounts.
- `installs?: InstallOptions[]`: Additional options for installing Python packages. For performance, consider memoizing this array if it's dynamically constructed to prevent unnecessary re-mounts.
- `languageServer?: boolean`: Whether to enable the language server for features like code completion.
- `className?: string`: Additional CSS class names to apply to the root container.
- `style?: React.CSSProperties`: Additional inline styles to apply to the root container.
- `onLoad?: (app: StliteKernel) => void`: Callback fired when the Stlite app is successfully mounted and ready.
- `onUnload?: () => void`: Callback fired when the Stlite app is unmounted.