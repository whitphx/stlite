import React, { useState, useMemo, useCallback, useRef } from "react";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { AppData } from "@stlite/sharing-common";
import styles from "./Editor.module.css";

export interface EditorProps {
  appData: AppData;
  onFileChange: (path: string, value: string) => void;
}

function Editor(props: EditorProps) {
  const fileNames = useMemo(
    () => Object.keys(props.appData.files),
    [props.appData]
  );
  const [currentFileName, setCurrentFileName] = useState<string | null>(
    fileNames.length > 0 ? fileNames[0] : null
  );

  const currentFile =
    currentFileName != null ? props.appData.files[currentFileName] : null;

  const editorRef = useRef<Parameters<OnMount>[0]>(null);

  const handleEditorDitMount = useCallback<OnMount>((editor, monaco) => {
    editorRef.current = editor;
  }, []);

  const onFileChange = props.onFileChange;
  const handleSave = useCallback(() => {
    if (currentFileName == null) {
      return;
    }
    const editor = editorRef.current;
    if (editor == null) {
      return;
    }
    onFileChange(currentFileName, editor.getValue());
  }, [onFileChange, currentFileName]);

  return (
    <div className={styles.container}>
      <div className={styles.tabArea}>
        {fileNames.map(fileName => (
          <button key={fileName} onClick={() => setCurrentFileName(fileName)}>
            {fileName}
          </button>
        ))}
      </div>
      <div className={styles.editorArea}>
        {currentFileName != null && currentFile?.content?.$case === "text" && (
          <MonacoEditor
            path={currentFileName}
            defaultLanguage="python"
            defaultValue={currentFile.content.text}
            onMount={handleEditorDitMount}
          />
        )}
      </div>
      <button onClick={handleSave}>Save</button>
    </div>
  );
}

export default Editor;
