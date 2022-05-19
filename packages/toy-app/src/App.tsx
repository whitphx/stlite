import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  StliteKernel,
  ConnectionManager,
  ConnectionState,
} from "stlite-kernel";
import { BackMsg } from "streamlit-browser/src/autogen/proto";

function App() {
  useEffect(() => {
    const kernel = new StliteKernel({
      pyodideUrl: "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js",
      command: "run",
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
