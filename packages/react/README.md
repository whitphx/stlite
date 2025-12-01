# @stlite/react

A React wrapper for [@stlite/browser](https://github.com/whitphx/stlite/tree/main/packages/browser) to embed Streamlit applications directly into your React projects.

## Installation

bash
npm install @stlite/react @stlite/browser react react-dom
# or
yarn add @stlite/react @stlite/browser react react-dom
# or
pnpm add @stlite/react @stlite/browser react react-dom


Also, remember to install `@stlite/browser`'s CSS file in your main application entry point (e.g., `main.tsx` or `App.tsx`):
typescript
// In your React app's entry file (e.g., main.tsx)
import '@stlite/browser/dist/style.css';


## Usage

jsx
import React from 'react';
import StliteApp from '@stlite/react';

function MyReactApp() {
  const pythonCode = `
import streamlit as st

st.title("Hello stlite in React!")
name = st.text_input("What's your name?")
if name:
    st.write(f"Hello, {name}!")
`;

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <StliteApp
        code={pythonCode}
        requirements={['numpy', 'pandas']}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}

export default MyReactApp;


For more advanced usage and options, refer to the [@stlite/browser documentation](https://github.com/whitphx/stlite/tree/main/packages/browser). All options available in `@stlite/browser`'s `mount` function (except `code` and `files` which are managed slightly differently) can be passed as props to the `StliteApp` component.

## API Reference

The `StliteApp` component accepts the following props:

- `code?: string`: The Python code to run. If `files` is also provided, this code will be saved as the `entrypoint` file. If only `code` is provided, it defaults to `streamlit_app.py`.
- `files?: Record<string, { data: string; type: "text" }> `: A record of files to be mounted on the Pyodide file system. The key is the file path (e.g., `"streamlit_app.py"`, `"pages/main.py"`, `"requirements.txt"`). The value is an object with `data` (string content) and `type` (`"text"`).
- `className?: string`: Additional CSS class names for the container div.
- `style?: React.CSSProperties`: Additional inline styles for the container div.
- All other options from `@stlite/browser`'s `StliteMountOptions` are directly supported as props (e.g., `entrypoint`, `requirements`, `pyodideUrl`, `sharedWorker`, `disableProgressToasts`, `disableErrorToasts`, `streamlitConfig`, `env`, `installs`, `languageServer`).