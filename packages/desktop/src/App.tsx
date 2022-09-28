import React, { useState, useEffect } from "react";
import { StliteKernel } from "@stlite/stlite-kernel";
import StreamlitApp from "./StreamlitApp";

async function loadSnapshotFile(): Promise<Uint8Array> {
  return window.snapshot.read();
}

function App() {
  const [kernel, setKernel] = useState<StliteKernel>();
  useEffect(() => {
    let unmounted = false;
    let kernel: StliteKernel | null = null;

    loadSnapshotFile().then((snapshotFileBin) => {
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
st.write("Hello,", name or "Electron!")`,
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
