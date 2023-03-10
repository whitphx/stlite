import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { AppData } from "@stlite/sharing-common";
import { parseRequirementsTxt } from "@stlite/common";
import TabBar from "./components/TabBar";
import Tab from "./components/Tab";
import Toolbar from "./components/Toolbar";
import ResizableHeader from "./components/ResizableHeader";
import BinaryFileEditor from "./BinaryFileEditor";
import FileUploader, { FileUploaderProps } from "./FileUploader";
import AddButton from "./components/AddButton";
import SaveButton from "./components/SaveButton";
import ThemeSelect from "./components/ThemeSelect";
import styles from "./Editor.module.scss";
import { isDarkMode } from "../color-mode";

let newFileCount = 1;

const REQUIREMENTS_FILENAME = "requirements";

export interface EditorProps {
  appData: AppData;
  onFileWrite: (path: string, value: string | Uint8Array) => void;
  onFileRename: (oldPath: string, newPath: string) => void;
  onFileDelete: (path: string) => void;
  onRequirementsChange: (requirements: string[]) => void;
}

function Editor({
  appData,
  onFileWrite,
  onFileRename,
  onFileDelete,
  onRequirementsChange,
}: EditorProps) {
  // Keep the tab order
  const [tabFileNames, setTabFileNames] = useState<string[]>(
    Object.keys(appData.files)
  );

  const fileNames = useMemo(
    () =>
      Object.keys(appData.files).sort((a, b) => {
        const aIdx = tabFileNames.indexOf(a);
        const bIdx = tabFileNames.indexOf(b);

        // If the key is not found in `tabFileNames` unexpectedly, put its tab at the right most.
        if (aIdx === -1) {
          return 1;
        }
        if (bIdx === -1) {
          return -1;
        }

        // Sort the keys of appData.files according to `tabFileNames`.
        return aIdx - bIdx;
      }),
    [appData, tabFileNames]
  );
  const [currentFileName, setCurrentFileName] = useState<string | null>(
    fileNames.length > 0 ? fileNames[0] : null
  );

  const currentFile =
    typeof currentFileName === "string" ? appData.files[currentFileName] : null;

  const editorRef = useRef<Parameters<OnMount>[0]>(null);
  const monacoRef = useRef<any>(null);
  const handleEditorDitMount = useCallback<OnMount>((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }, []);
  useEffect(() => {
    return () => {
      const monaco = monacoRef.current;
      if (monaco) {
        // Clear all the existing models. Ref: https://stackoverflow.com/a/62466612/13103190
        // If we don't do it, the previous content will remain after changing the sample apps.
        // @ts-ignore
        monaco.editor.getModels().forEach((model) => model.dispose());
      }
    };
  }, []);

  const handleSave = useCallback(() => {
    if (currentFileName == null) {
      return;
    }
    const editor = editorRef.current;
    if (editor == null) {
      return;
    }

    const value: string = editor.getValue();
    if (currentFileName === REQUIREMENTS_FILENAME) {
      const requirements = parseRequirementsTxt(value);
      onRequirementsChange(requirements);
      return;
    }

    onFileWrite(currentFileName, value);
  }, [onFileWrite, onRequirementsChange, currentFileName]);

  const handleBinaryFileChange = useCallback(
    (data: Uint8Array) => {
      if (currentFileName == null) {
        return;
      }
      if (typeof currentFileName !== "string") {
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
        setTabFileNames((cur) => [...cur, file.name]);
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
      setTabFileNames((cur) => cur.filter((f) => f !== fileName));
    },
    [onFileDelete]
  );

  const handleCreateFile = useCallback(() => {
    const fileName = `file${newFileCount}.py`;
    newFileCount += 1;

    onFileWrite(fileName, "");
    focusTabNext(fileName);
    setTabFileNames((cur) => [...cur, fileName]);
  }, [onFileWrite, focusTabNext]);

  const showTextEditor =
    currentFile?.content?.$case === "text" ||
    currentFileName === REQUIREMENTS_FILENAME;

  const defaultRequirementsTextValue = useMemo(
    () => appData.requirements.join("\n"),
    [appData.requirements]
  );

  const [isDarkTheme, setIsDarkTheme] = useState(isDarkMode());

  return (
    <div className={styles.container}>
      <ResizableHeader
        resizableArea={
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
                  setTabFileNames((cur) =>
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

            <div className={styles.requirementsTabContainer}>
              <Tab
                selected={currentFileName === REQUIREMENTS_FILENAME}
                fileNameEditable={false}
                initInEditingModeIfSelected={false}
                fileName={REQUIREMENTS_FILENAME}
                onSelect={() => setCurrentFileName(REQUIREMENTS_FILENAME)}
                onDelete={() => null}
                onFileNameChange={() => null}
              />
            </div>
          </TabBar>
        }
        fixedFooter={
          showTextEditor && (
            <Toolbar>
              <SaveButton onClick={handleSave} />
              <ThemeSelect isDark={isDarkTheme} onChange={setIsDarkTheme} />
            </Toolbar>
          )
        }
      />
      <div className={styles.editorArea}>
        <div
          // NOTE: Keep the monaco-editor component being mounted
          // and control its visibility with the hidden attribute here
          // instead of mounting/unmounting the component according to the file type
          // because it leads to flickering.
          hidden={!showTextEditor}
          style={{ height: "100%" }}
        >
          <MonacoEditor
            path={
              typeof currentFileName === "string" ? currentFileName : undefined
            }
            defaultValue={
              currentFileName === REQUIREMENTS_FILENAME
                ? defaultRequirementsTextValue
                : currentFile?.content?.$case === "text"
                ? currentFile.content.text
                : undefined
            }
            onMount={handleEditorDitMount}
            theme={isDarkTheme ? "vs-dark" : "light"}
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
