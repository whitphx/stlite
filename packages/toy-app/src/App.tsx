import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  StliteKernel,
  ConnectionManager,
  ConnectionState,
} from "@stlite/kernel";
import { BackMsg } from "streamlit-browser/src/autogen/proto";

function App() {
  useEffect(() => {
    const kernel = new StliteKernel({
      entrypoint: "streamlit_app.py",
      files: {
        "streamlit_app.py": {
          data: `import streamlit as st

st.write("Hello World")
`,
        },
      },
      requirements: [],
    });

    kernel
      .sendHttpRequest({
        path: "/healthz",
        method: "GET",
        headers: {},
        body: new Uint8Array(),
      })
      .then(({ statusCode, headers, body }) => {
        if (headers.get("Content-Type")?.startsWith("text/")) {
          const text = new TextDecoder().decode(body);
          console.log("HTTP Response", { statusCode, headers, text });
        } else {
          console.log("HTTP Response", { statusCode, headers, body });
        }
      });

    const connectionManager = new ConnectionManager({
      kernel,
      connectionStateChanged: (connectionState) => {
        console.log("connectionStateChanged", connectionState);

        if (connectionState === ConnectionState.CONNECTED) {
          connectionManager.sendMessage(
            new BackMsg({
              rerunScript: { queryString: "" },
            })
          );

          setTimeout(() => {
            console.log("Set a new script");
            kernel.writeFile(
              "streamlit_app.py",
              `import streamlit as st

st.write("Hello, a new script")
`
            );
          }, 1000);
        }
      },

      onMessage: (message) => {
        console.log("onMessage", message);
      },
      onConnectionError: (errNode) => {
        console.error("onConnectionError", errNode);
      },
    });

    return () => {
      kernel.dispose();
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
