import React, { useEffect, useState, useMemo } from "react";
import "./App.css";
import { embedAppDataToUrl, AppData } from "@stlite/sharing-common";

const SHARING_APP_URL =
  process.env.REACT_APP_SHARING_APP_URL ?? "http://localhost:3000/";

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
            content: {
              $case: "text",
              text: `
import streamlit as st
from PIL import Image

st.title("Main page")

image = Image.open('data/logo.png')
st.image(image, caption='Sunrise by the mountains')
`,
            },
          },
          "pages/page1.py": {
            content: {
              $case: "text",
              text: `
import streamlit as st

st.title("Sub page")`,
            },
          },
          "data/logo.png": {
            content: {
              $case: "data",
              data: new Uint8Array(binary),
            },
          },
        },
        requirements: [],
      });
    });
    return;
  }, []);

  const url = useMemo(
    () => (appData ? embedAppDataToUrl(SHARING_APP_URL, appData) : null),
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
