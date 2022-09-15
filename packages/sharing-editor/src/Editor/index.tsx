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
  const [orderedFileNames, setOrderedFileNames] = useState<string[]>(
    Object.keys(appData.files)
  );
  const fileNames = useMemo(
    () =>
      Object.keys(appData.files).sort(
        (a, b) => orderedFileNames.indexOf(a) - orderedFileNames.indexOf(b)
      ),
    [appData, orderedFileNames]
  );
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

  const [addedFileName, setAddedFileName] = useState<string>();
  const focusTabNext = useCallback((fileName) => {
    setCurrentFileName(fileName);
    setAddedFileName(fileName);
  }, []);

  const handleFileUpload = useCallback<FileUploaderProps["onUpload"]>(
    (files) => {
      files.forEach((file) => {
        if (file.type.startsWith("text")) {
          const text = new TextDecoder().decode(file.data);
          onFileWrite(file.name, text);
          focusTabNext(file.name);
        } else {
          onFileWrite(file.name, file.data);
          focusTabNext(file.name);
        }
      });
    },
    [onFileWrite, focusTabNext]
  );

  const handleFileDelete = useCallback(
    (fileName) => {
      const confirmed = window.confirm(`Delete ${fileName}?`);
      if (!confirmed) {
        return;
      }

      onFileDelete(fileName);
      setOrderedFileNames((cur) => cur.filter((f) => f !== fileName));
    },
    [onFileDelete]
  );

  const handleCreateFile = useCallback(() => {
    const fileName = `file${newFileCount}.py`;
    newFileCount += 1;

    onFileWrite(fileName, "");
    focusTabNext(fileName);
    setOrderedFileNames((cur) => [...cur, fileName]);
  }, [onFileWrite, focusTabNext]);

  return (
    <div className={styles.container}>
      <TabBar>
        {fileNames.map((fileName) => (
          <Tab
            key={fileName}
            selected={fileName === currentFileName}
            fileNameEditable={fileName !== appData.entrypoint}
            initInEditingModeIfSelected={fileName === addedFileName}
            fileName={fileName}
            onSelect={() => setCurrentFileName(fileName)}
            onDelete={() => handleFileDelete(fileName)}
            onFileNameChange={(newPath) => {
              onFileRename(fileName, newPath);
              setOrderedFileNames((cur) =>
                cur.map((f) => (f === fileName ? newPath : f))
              );
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
      {currentFile?.content?.$case === "text" && (
        <Toolbar>
          <SaveButton onClick={handleSave} />
        </Toolbar>
      )}
      <div className={styles.editorArea}>
        <div
          // NOTE: Keep the monaco-editor component being mounted
          // and control its visibility with the hidden attribute here
          // instead of mounting/unmounting the component according to the file type
          // because it leads to flickering.
          hidden={currentFile?.content?.$case !== "text"}
          style={{ height: "100%" }}
        >
          <MonacoEditor
            path={currentFileName ?? undefined}
            defaultValue={
              currentFile?.content?.$case === "text"
                ? currentFile.content.text
                : undefined
            }
            onMount={handleEditorDitMount}
            theme={isDarkMode() ? "vs-dark" : "vs-light"}
          />
        </div>
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
