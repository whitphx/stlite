# `@stlite/react`

This package provides a React component for embedding Stlite applications into your React app.
It wraps the core functionality from [`@stlite/browser`](./packages/browser/README.md).

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
import '@stlite/browser/dist/stlite.css'; // IMPORTANT: Import the CSS file

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

### `StliteAppProps`

Props for the `StliteApp` component. It extends `StliteMountOptions` from `@stlite/browser`
with some additional React-specific props.

- `code?: string`: The Python code of the Streamlit app. This prop is mutually exclusive with `files`.
  If neither `code` nor `files` is provided, a default "Hello world" app will be displayed.
  If `entrypoint` is not provided, `"streamlit_app.py"` will be used as the entrypoint.
- `files?: Record<string, { data: string; type: "text" }>`: A record of files to be mounted on the Pyodide file system. The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`). The value is an object with `data` (string content) and `type` (`"text"`).
- `entrypoint?: string`: The entrypoint file (e.g., `"streamlit_app.py"`).
- `requirements?: string[]`: A list of Python package names to install (e.g., `["numpy", "pandas"]`).
- `pyodideUrl?: string`: URL of the Pyodide distribution.
- `sharedWorker?: boolean`: If `true`, a SharedWorker will be used for the Pyodide kernel. This allows multiple Stlite apps to share the same kernel instance across tabs.
- `disableProgressToasts?: boolean`: If `true`, the progress toasts (e.g., "Installing packages...") will be disabled.
- `disableErrorToasts?: boolean`: If `true`, the error toasts will be disabled.
- `streamlitConfig?: Record<string, Record<string, string>>`: A record of Streamlit configuration options to be written to `.streamlit/config.toml`.
- `env?: Record<string, string>`: Environment variables to be set in the Pyodide environment.
- `installs?: InstallOptions[]`: Additional options for installing Python packages.
- `languageServer?: boolean`: If `true`, the language server will be enabled for code completion and diagnostics.
- `className?: string`: Additional CSS class name for the root container.
- `style?: React.CSSProperties`: Additional inline CSS styles for the root container.
- `onLoad?: (app: StliteKernel) => void`: Callback fired when the Stlite app is successfully mounted and ready.
- `onUnload?: () => void`: Callback fired when the Stlite app is unmounted.