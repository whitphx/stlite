import React, { useState, useMemo, useCallback, useRef } from "react";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { AppData } from "@stlite/sharing-common";
import TabBar from "./components/TabBar";
import Tab from "./components/Tab";
import Toolbar from "./components/Toolbar";
import BinaryFileEditor from "./BinaryFileEditor";
import FileUploader, { FileUploaderProps } from "./FileUploader";
import AddButton from "./components/AddButton";
import SaveButton from "./components/SaveButton";
import styles from "./Editor.module.scss";
import { isDarkMode } from "../color-mode";

let newFileCount = 1;

export interface EditorProps {
  appData: AppData;
  onFileWrite: (path: string, value: string | Uint8Array) => void;
  onFileRename: (oldPath: string, newPath: string) => void;
  onFileDelete: (path: string) => void;
}

function Editor({
  appData,
  onFileWrite,
  onFileRename,
  onFileDelete,
}: EditorProps) {
  const fileNames = useMemo(() => Object.keys(appData.files), [appData]);
  const [currentFileName, setCurrentFileName] = useState<string | null>(
    fileNames.length > 0 ? fileNames[0] : null
  );

  const currentFile =
    currentFileName != null ? appData.files[currentFileName] : null;

  const editorRef = useRef<Parameters<OnMount>[0]>(null);

  const handleEditorDitMount = useCallback<OnMount>((editor, monaco) => {
    editorRef.current = editor;
  }, []);

  const handleSave = useCallback(() => {
    if (currentFileName == null) {
      return;
    }
    const editor = editorRef.current;
    if (editor == null) {
      return;
    }
    onFileWrite(currentFileName, editor.getValue());
  }, [onFileWrite, currentFileName]);

  const handleBinaryFileChange = useCallback(
    (data: Uint8Array) => {
      if (currentFileName == null) {
        return;
      }
      onFileWrite(currentFileName, data);
    },
    [onFileWrite, currentFileName]
  );

  const handleFileUpload = useCallback<FileUploaderProps["onUpload"]>(
    (files) => {
      files.forEach((file) => {
        if (file.type.startsWith("text")) {
          const text = new TextDecoder().decode(file.data);
          onFileWrite(file.name, text);
        } else {
          onFileWrite(file.name, file.data);
        }
      });
    },
    [onFileWrite]
  );

  const handleFileDelete = useCallback(
    (fileName) => {
      onFileDelete(fileName);
    },
    [onFileDelete]
  );

  const [addedFileName, setAddedFileName] = useState<string>();
  const handleCreateFile = useCallback(() => {
    const fileName = `file${newFileCount}.py`;
    newFileCount += 1;

    onFileWrite(fileName, "");
    setCurrentFileName(fileName);
    setAddedFileName(fileName);
  }, [onFileWrite]);

  return (
    <div className={styles.container}>
      <TabBar>
        {fileNames.map((fileName) => (
          <Tab
            key={fileName}
            selected={fileName === currentFileName}
            initInEditingModeIfSelected={fileName === addedFileName}
            fileName={fileName}
            onSelect={() => setCurrentFileName(fileName)}
            onDelete={() => handleFileDelete(fileName)}
            onFileNameChange={(newPath) => {
              onFileRename(fileName, newPath);
              if (fileName === currentFileName) {
                setCurrentFileName(newPath);
              }
            }}
          />
        ))}
        <div className={styles.controlButtonGroup}>
          <AddButton onClick={handleCreateFile} />
          <FileUploader onUpload={handleFileUpload} />
        </div>
      </TabBar>
      <Toolbar>
        <SaveButton onClick={handleSave} />
      </Toolbar>
      <div className={styles.editorArea}>
        {currentFileName != null && currentFile?.content?.$case === "text" && (
          <MonacoEditor
            path={currentFileName}
            defaultValue={currentFile.content.text}
            onMount={handleEditorDitMount}
            theme={isDarkMode() ? "vs-dark" : "vs-light"}
          />
        )}
        {currentFileName != null && currentFile?.content?.$case === "data" && (
          <BinaryFileEditor
            path={currentFileName}
            data={currentFile.content.data}
            onChange={handleBinaryFileChange}
          />
        )}
      </div>
    </div>
  );
}

export default Editor;
