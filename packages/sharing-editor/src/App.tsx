import React from "react";
import "./App.css";
import {
  encodeAppData,
  EncodableAppData,
  URL_HASH_KEY,
} from "@stlite/sharing-common";

const SHARING_URL =
  process.env.NODE_ENV === "production"
    ? "/" // Assuming this editor app is hosted at "/editor" and the main app is at "/" with the same host name.
    : "http://localhost:3000/";

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
