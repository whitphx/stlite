import React, { useState, useEffect } from "react";
import { StliteKernel } from "@stlite/stlite-kernel";
import StreamlitApp from "./StreamlitApp";

function App() {
  const [kernel, setKernel] = useState<StliteKernel>();
  useEffect(() => {
    let unmounted = false;
    let kernel: StliteKernel | null = null;

    window.snapshot.read().then((snapshotFileBin) => {
      if (unmounted) {
        return;
      }

      const snapshotMountFilePath = "/tmp/stlite-snapshot.tar.gz";
      kernel = new StliteKernel({
        command: "run",
        entrypoint: "streamlit_app.py",
        files: {
          "streamlit_app.py": {
            data: `import streamlit as st

name = st.text_input("name")
st.write("Hello,", name or "Electron!")

import matplotlib.pyplot as plt
import numpy as np

size = st.slider("Sample size", 100, 1000, 100)
arr = np.random.normal(1, 1, size=size)
fig, ax = plt.subplots()
ax.hist(arr, bins=20)

st.pyplot(fig)

st.image("https://raw.githubusercontent.com/whitphx/stlite/main/docs/images/logo.svg")
`,
          },
          [snapshotMountFilePath]: {
            data: snapshotFileBin,
          },
        },
        requirements: [],
        mountedSnapshotFilePath: snapshotMountFilePath,
      });
      setKernel(kernel);
    });

    return () => {
      unmounted = true;
      kernel && kernel.dispose();
    };
  }, []);

  return kernel ? <StreamlitApp kernel={kernel} /> : null;
}

export default App;
