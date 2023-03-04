import React, { useMemo } from "react";
import StreamlitApp from "./StreamlitApp";
import { StliteKernel } from "@stlite/kernel";
import "@stlite/common-react/src/toastify-components/toastify.css";

function App() {
  const kernel = useMemo(() => {
    return new StliteKernel({
      entrypoint: "streamlit_app.py",
      files: {
        "streamlit_app.py": {
          data: `import streamlit as st
st.title("Hello, world!")
st.write("This is some text")
st.write("This is some more text")
`,
        },
      },
      requirements: [],
    });
  }, []);

  return <StreamlitApp kernel={kernel} />;
}

export default App;
