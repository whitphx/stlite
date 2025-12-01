# Stlite: In-browser Streamlit

**Serverless [Streamlit](https://streamlit.io/) Running Entirely in Your Browser**

[![Test and Build](https://github.com/whitphx/stlite/actions/workflows/test-build.yml/badge.svg)](https://github.com/whitphx/stlite/actions/workflows/test-build.yml)
[![Postbuild](https://github.com/whitphx/stlite/actions/workflows/postbuild.yml/badge.svg)](https://github.com/whitphx/stlite/actions/workflows/postbuild.yml)
This project is tested with BrowserStack.

[![npm (scoped)](https://img.shields.io/npm/v/@stlite/browser?label=%40stlite%2Fbrowser)](https://www.npmjs.com/package/@stlite/browser)
[![npm (@stlite/desktop)](https://img.shields.io/npm/v/@stlite/desktop?label=%40stlite%2Fdesktop)](https://www.npmjs.com/package/@stlite/desktop)

<a href="https://flatt.tech/oss/gmo/trampoline" target="_blank"><img src="https://flatt.tec
# `@stlite/react`

This package provides a React component for embedding Stlite applications.

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

-   `code?: string`: The Python code of the Streamlit app. If provided, it will be mounted as `"streamlit_app.py"`. If both `code` and `files` are provided, `code` takes precedence for the `entrypoint`.
-   `files?: Record<string, { data: string; type: "text" }>`: A record of files to be mounted on the Pyodide file system. The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`). The value is an object with `data` (string content) and `type` (`"text"`).
-   `entrypoint?: string`: The path to the Python file to be executed as the entrypoint (e.g., `"streamlit_app.py"`). If not provided and `code` is set, `"streamlit_app.py"` will be used as the entrypoint. If neither `code` nor `entrypoint` is provided, an error will be thrown by `@stlite/browser`.
-   `requirements?: string[]`: A list of Python package names to install (e.g., `["numpy", "pandas"]`).
-   `pyodideUrl?: string`: The URL to the Pyodide distribution.
-   `sharedWorker?: boolean`: Whether to use a SharedWorker for the Pyodide kernel. This allows multiple Stlite apps on the same page to share a single Pyodide instance.
-   `disableProgressToasts?: boolean`: Whether to disable the progress toasts.
-   `disableErrorToasts?: boolean`: Whether to disable the error toasts.
-   `streamlitConfig?: Record<string, any>`: An object representing the TOML configuration for Streamlit (e.g., `{ "server": { "port": 8501 } }`). This will be written to `.streamlit/config.toml` in the Pyodide file system.
-   `env?: Record<string, string>`: Environment variables to set in the Pyodide worker.
-   `installs?: InstallationOptions[]`: A list of installation options for Python packages.
-   `languageServer?: boolean`: Whether to enable the Python language server for features like code completion.
-   `className?: string`: Additional CSS class names to apply to the container div.
-   `style?: React.CSSProperties`: Additional CSS styles to apply to the container div.
-   `onLoad?: (app: StliteApp) => void`: Callback fired when the Stlite app is successfully mounted and ready.
-   `onUnload?: () => void`: Callback fired when the Stlite app is unmounted.