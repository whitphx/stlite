# Stlite: In-browser Streamlit with React

[![npm (scoped)](https://img.shields.io/npm/v/@stlite/react?label=%40stlite%2Freact)](https://www.npmjs.com/package/@stlite/react)

This package provides a React component wrapper for `@stlite/browser`, allowing you to embed [Streamlit](https://streamlit.io/) applications directly into your React projects.

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

- `code?: string`: The Python code of your Streamlit application. This is mounted as `streamlit_app.py` by default.
- `files?: Record<string, { data: string; type: "text" }>`: A record of files to be mounted on the Pyodide file system. The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`). The value is an object with `data` (string content) and `type` (`"text"`).
- `entrypoint?: string`: The path to the Python file to be executed as the Streamlit entrypoint (e.g., `"streamlit_app.py"`). If `code` is provided and `entrypoint` is omitted, it defaults to `"streamlit_app.py"`.
- `requirements?: string[]`: A list of Python package requirements (e.g., `["numpy", "pandas"]`).
- `pyodideUrl?: string`: The URL to the Pyodide distribution. Defaults to the one bundled with `@stlite/browser`.
- `sharedWorker?: boolean`: If `true`, a SharedWorker will be used to run Pyodide, allowing multiple Stlite apps on the same page to share a single Python kernel. Defaults to `false`.
- `disableProgressToasts?: boolean`: If `true`, toasts for Pyodide/package installation progress will be disabled. Defaults to `false`.
- `disableErrorToasts?: boolean`: If `true`, toasts for Python runtime errors will be disabled. Defaults to `false`.
- `streamlitConfig?: Record<string, any>`: An object representing the Streamlit configuration. This will be converted to `toml` format and mounted as `.streamlit/config.toml`.
- `env?: Record<string, string>`: An object representing environment variables to be set in the Pyodide environment.
- `installs?: Record<string, any>[]`: A list of objects specifying custom Pyodide install configurations. Each object can contain `requirements` (a list of packages) and `options` (an object of Pyodide install options).
- `languageServer?: boolean`: If `true`, enables the Python language server for features like code completion. Defaults to `false`.
- `className?: string`: Additional CSS class names to apply to the container `div`.
- `style?: React.CSSProperties`: Additional inline styles to apply to the container `div`.
- `onLoad?: (app: StliteAppBrowser) => void`: A callback function that is called when the Stlite app is loaded and mounted successfully. It receives the `StliteAppBrowser` controller instance as an argument.
- `onUnload?: () => void`: A callback function that is called when the Stlite app is unmounted.

## License

This project is licensed under the Apache License 2.0.