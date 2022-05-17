import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import { StliteKernel } from "stlite-kernel";

function App() {
  useEffect(() => {
    const kernel = new StliteKernel({
      pyodideUrl: "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js",
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
