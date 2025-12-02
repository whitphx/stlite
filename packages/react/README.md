# `@stlite/react`

A React component for embedding Streamlit applications powered by Stlite.
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

- `code?: string`: The Python code of the Streamlit app. If provided, it overrides `files`.
- `files?: Record<string, { data: string; type: "text" }>`: A record of files to be mounted on the Pyodide file system. The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`). The value is an object with `data` (string content) and `type` (`"text"`).
- `entrypoint?: string`: The entrypoint file to run (e.g., `"streamlit_app.py"`). If `code` is provided and `entrypoint` is not, `"streamlit_app.py"` will be used as the entrypoint.
- `requirements?: string[]`: A list of Python package names to install (e.g., `["numpy", "pandas"]`).
- `pyodideUrl?: string`: The URL to load Pyodide from.
- `sharedWorker?: boolean`: If `true`, a SharedWorker is used for the Python runtime, allowing multiple Stlite apps on the same page to share a single Pyodide kernel.
- `disableProgressToasts?: boolean`: If `true`, disables progress toasts shown during package installation or app initialization.
- `disableErrorToasts?: boolean`: If `true`, disables error toasts.
- `streamlitConfig?: StreamlitConfig`: An object representing the Streamlit configuration. This will be written to `.streamlit/config.toml`. See `StreamlitConfig` type for details. **Note**: If `streamlitConfig` is dynamically constructed, please memoize it (`React.useMemo`) to prevent unnecessary component remounts.
- `env?: Record<string, string>`: Environment variables to set for the Pyodide runtime. **Note**: If `env` is dynamically constructed, please memoize it (`React.useMemo`) to prevent unnecessary component remounts.
- `installs?: InstallOptions[]`: Advanced installation options for Python packages. See `InstallOptions` type from `@stlite/browser` for details. **Note**: If `installs` is dynamically constructed, please memoize it (`React.useMemo`) to prevent unnecessary component remounts.
- `languageServer?: boolean`: If `true`, enables the Python language server for features like code completion.
- `className?: string`: Additional CSS class names to apply to the container `div`.
- `style?: React.CSSProperties`: Inline styles to apply to the container `div`.
- `onLoad?: (app: StliteKernel) => void`: Callback fired when the Stlite app is successfully mounted and ready. The `app` object provides direct access to the `StliteKernel` instance.
- `onUnload?: () => void`: Callback fired when the Stlite app is unmounted.

**Important for performance**: For object or array-based props like `requirements`, `streamlitConfig`, `env`, and `installs`, it is highly recommended to memoize their values using `React.useMemo` if they are dynamically created. Otherwise, React might detect a new reference on every render and unnecessarily remount the Stlite app.