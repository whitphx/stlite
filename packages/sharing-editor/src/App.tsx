import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import { embedAppDataToUrl, AppData } from "@stlite/sharing-common";

const DEFAULT_SHARING_APP_URL =
  process.env.REACT_APP_SHARING_APP_URL ?? "http://localhost:3000/";

// NOTE: This is only for the very beginning phase of the development.
// TODO: Remove this feature because it can be used for phishing.
const SHARING_URL =
  new URLSearchParams(window.location.search).get("app") ??
  DEFAULT_SHARING_APP_URL;

// NOTE: Only for dev and demo purpose
const stliteLogoPngUrl = "https://whitphx.github.io/stlite/logo512.png";
let stliteLogoPng: ArrayBuffer | undefined = undefined;
const fetchStliteLogoPngUrl = (): Promise<ArrayBuffer> => {
  if (stliteLogoPng) {
    return Promise.resolve(stliteLogoPng);
  }

  return fetch(stliteLogoPngUrl)
    .then((res) => res.arrayBuffer())
    .then((binary) => {
      stliteLogoPng = binary;
      return stliteLogoPng;
    });
};

function App() {
  const [appData, setAppData] = useState<AppData>();
  useEffect(() => {
    fetchStliteLogoPngUrl().then((binary) => {
      setAppData({
        entrypoint: "streamlit_app.py",
        files: {
          "streamlit_app.py": {
            type: "text",
            data: `
import streamlit as st
from PIL import Image

st.title("Main page")

image = Image.open('data/logo.png')
st.image(image, caption='Sunrise by the mountains')
              `,
          },
          "pages/page1.py": {
            type: "text",
            data: `
import streamlit as st

st.title("Sub page")`,
          },
          "data/logo.png": {
            type: "arraybuffer",
            data: binary,
          },
        },
        requirements: [],
      });
    });
    return;
  }, []);

  const url = useMemo(
    () => (appData ? embedAppDataToUrl(SHARING_URL, appData) : null),
    [appData]
  );

  return (
    <div className="App">
      <div className="editor-pane"></div>
      {url && (
        <div className="preview-pane">
          <p>
            <a href={url} target="_blank" rel="noreferrer">
              Open App
            </a>
          </p>
          <iframe
            src={url}
            frameBorder="0"
            title="stlite app"
            className="preview-iframe"
          />
        </div>
      )}
    </div>
  );
}

export default App;
