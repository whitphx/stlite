import React, { useState, useEffect } from "react";
import { StliteKernel, StliteKernelOptions } from "@stlite/stlite-kernel";
import StreamlitApp from "./StreamlitApp";

async function loadWheels(): Promise<
  Record<keyof NonNullable<StliteKernelOptions["wheelUrls"]>, ArrayBuffer>
> {
  // TODO: Load the files from local. Fetching remote resources below is just as mock for dev.
  const urls = [
    [
      "https://cdn.jsdelivr.net/npm/@stlite/mountable@0.7.0/build/pypi/tornado-6.2-py3-none-any.whl",
    ],
    [
      "https://cdn.jsdelivr.net/npm/@stlite/mountable@0.7.0/build/pypi/stlite_pyarrow-0.1.0-py3-none-any.whl",
    ],
    [
      "https://cdn.jsdelivr.net/npm/@stlite/mountable@0.7.0/build/pypi/streamlit-1.12.0-py2.py3-none-any.whl",
    ],
  ];
  const arrayBuffers = await Promise.all(
    urls
      .map(([url]) => fetch(url))
      .map((fetchPromise) =>
        fetchPromise.then((response) => response.arrayBuffer())
      )
  );

  return {
    tornado: arrayBuffers[0],
    pyarrow: arrayBuffers[1],
    streamlit: arrayBuffers[2],
  };
}

function App() {
  const [kernel, setKernel] = useState<StliteKernel>();
  useEffect(() => {
    let unmounted = false;
    let kernel: StliteKernel | null = null;

    loadWheels().then((wheels) => {
      if (unmounted) {
        return;
      }

      kernel = new StliteKernel({
        command: "run",
        entrypoint: "streamlit_app.py",
        files: {
          "streamlit_app.py": {
            data: `import streamlit as st

name = st.text_input("name")
st.write("Hello,", name or "Electron!")`,
          },
          "/tmp/tornado-6.2-py3-none-any.whl": {
            data: new Uint8Array(wheels.tornado),
          },
          "/tmp/stlite_pyarrow-0.1.0-py3-none-any.whl": {
            data: new Uint8Array(wheels.pyarrow),
          },
          "/tmp/streamlit-1.12.0-py2.py3-none-any.whl": {
            data: new Uint8Array(wheels.streamlit),
          },
        },
        requirements: [],
        wheelUrls: {
          tornado: "emfs:/tmp/tornado-6.2-py3-none-any.whl",
          pyarrow: "emfs:/tmp/stlite_pyarrow-0.1.0-py3-none-any.whl",
          streamlit: "emfs:/tmp/streamlit-1.12.0-py2.py3-none-any.whl",
        },
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
