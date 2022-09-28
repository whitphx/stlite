import React, { useState, useEffect } from "react";
import {
  StliteKernel,
  StliteKernelOptions,
  wheels as wheelPaths,
} from "@stlite/stlite-kernel";
import StreamlitApp from "./StreamlitApp";

const currentURL = window.location.href;
const parentURL = currentURL.split("/").slice(0, -1).join("/") + "/";

const wheelUrls = {
  tornado: parentURL + wheelPaths.tornado,
  pyarrow: parentURL + wheelPaths.pyarrow,
  streamlit: parentURL + wheelPaths.streamlit,
};

console.debug({ currentURL, parentURL, wheelUrls });

async function loadWheels(): Promise<
  Record<keyof NonNullable<StliteKernelOptions["wheelUrls"]>, Uint8Array>
> {
  const arrayBuffers = await Promise.all<Uint8Array>(
    [wheelUrls.tornado, wheelUrls.pyarrow, wheelUrls.streamlit].map(
      (wheelUrl) => {
        if (wheelUrl.startsWith("file://")) {
          console.debug("Read a local file", wheelUrl);
          return window.localWheelFiles.read(
            wheelUrl.replace(/^file:\/\//, "")
          );
        } else {
          console.debug("Read a remote file", wheelUrl);
          return fetch(wheelUrl)
            .then((response) => response.arrayBuffer())
            .then((ab) => new Uint8Array(ab));
        }
      }
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

      const tornadoEmfsPath = "/tmp" + wheelPaths.tornado;
      const pyarrowEmfsPath = "/tmp" + wheelPaths.pyarrow;
      const streamlitEmfsPath = "/tmp" + wheelPaths.streamlit;
      kernel = new StliteKernel({
        command: "run",
        entrypoint: "streamlit_app.py",
        files: {
          "streamlit_app.py": {
            data: `import streamlit as st

name = st.text_input("name")
st.write("Hello,", name or "Electron!")`,
          },
          [tornadoEmfsPath]: {
            data: new Uint8Array(wheels.tornado),
          },
          [pyarrowEmfsPath]: {
            data: new Uint8Array(wheels.pyarrow),
          },
          [streamlitEmfsPath]: {
            data: new Uint8Array(wheels.streamlit),
          },
        },
        requirements: [],
        wheelUrls: {
          tornado: `emfs:${tornadoEmfsPath}`,
          pyarrow: `emfs:${pyarrowEmfsPath}`,
          streamlit: `emfs:${streamlitEmfsPath}`,
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
