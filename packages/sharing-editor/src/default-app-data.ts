import { AppData } from "@stlite/sharing-common";
import stliteLogoPngUrl from "./logo192.png";

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

export function loadDefaultAppData(): Promise<AppData> {
  return fetchStliteLogoPngUrl().then((binary) => {
    return {
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
st.image(image, caption='stlite logo')
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
    };
  });
}
