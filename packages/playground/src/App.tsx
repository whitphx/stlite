import React, { useRef, useState, useCallback } from "react";
import "./App.css";

import ThemedApp from "streamlit-browser/src/ThemedApp";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";
const engine = new Styletron({ prefix: "st-" });

function App() {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const [mainScriptData, setMainScriptData] = useState("");

  return (
    <>
      <div className="editor-container">
        {/* TODO: Make the editor floating and draggable */}
        <textarea defaultValue={mainScriptData} ref={editorRef} />
        <button
          onClick={useCallback(() => {
            const editorElem = editorRef.current;
            if (editorElem == null) {
              return;
            }
            setMainScriptData(editorElem.value);
          }, [])}
        >
          Save
        </button>
      </div>
      <StyletronProvider value={engine}>
        <ThemedApp stliteMainScriptData={mainScriptData} />
      </StyletronProvider>
    </>
  );
}

export default App;
