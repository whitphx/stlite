import React from "react";
import "./App.css";
import {
  encodeAppData,
  EncodableAppData,
  URL_HASH_KEY,
} from "@stlite/sharing-common";

const DEFAULT_SHARING_URL =
  process.env.NODE_ENV === "production"
    ? "/" // Assuming this editor app is hosted at "/editor" and the main app is at "/" with the same host name.
    : "http://localhost:3000/";

// NOTE: This is only for the very beginning phase of the development.
// TODO: Remove this feature because it can be used for phishing.
const SHARING_URL =
  new URLSearchParams(window.location.search).get("app") ?? DEFAULT_SHARING_URL;

// A sample data for dev
const appData: EncodableAppData = {
  entrypoint: "streamlit_app.py",
  files: {
    "streamlit_app.py": {
      type: "text",
      data: `
import streamlit as st

st.title("Main page")
      `,
    },
    "pages/page1.py": {
      type: "text",
      data: `
import streamlit as st

st.title("Sub page")`,
    },
  },
  requirements: [],
};

function App() {
  return (
    <div className="App">
      <div className="editor-pane"></div>
      <div className="preview-pane">
        <iframe
          src={`${SHARING_URL}#${URL_HASH_KEY}=${encodeAppData(appData)}`}
          frameBorder="0"
          title="stlite app"
          className="preview-iframe"
        />
      </div>
    </div>
  );
}

export default App;
