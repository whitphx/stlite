import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useImperativeHandle,
} from "react";
import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { AppData } from "@stlite/sharing-common";
import { parseRequirementsTxt } from "@stlite/common";
import TabBar from "./components/TabBar";
import Tab from "./components/Tab";
import Toolbar from "./components/Toolbar";
import ResizableHeader from "./components/ResizableHeader";
import BinaryFileEditor from "./BinaryFileEditor";
import FileUploader, {
  FileUploaderProps,
  isDirectoryUploadSupported,
} from "./FileUploader";
import AddButton from "./components/AddButton";
import SaveButton from "./components/SaveButton";
import styles from "./Editor.module.scss";
// import { isDarkMode } from "../color-mode";
import { useDarkMode } from "../ColorScheme/hooks";
import type { IDisposable } from "monaco-editor/esm/vs/editor/editor.api";
import {
  CodeCompletionProvider,
  CodeCompleter,
} from "./LanguageProviders/CodeCompletionProvider";

export type { CodeCompleter };

let newFileCount = 1;

const REQUIREMENTS_FILENAME = "requirements";

export interface EditorRef {
  addRequirements: (requirements: string[]) => void;
}
export interface EditorProps {
  appData: AppData;
  codeCompleter: CodeCompleter;
  onFileWrite: (path: string, value: string | Uint8Array) => void;
  onFileRename: (oldPath: string, newPath: string) => void;
  onFileDelete: (path: string) => void;
  onRequirementsChange: (requirements: string[]) => void;
  onEntrypointChange: (entrypoint: string) => void;
}

const Editor = React.forwardRef<EditorRef, EditorProps>(
  (
    {
      appData,
      codeCompleter,
      onFileWrite,
      onFileRename,
      onFileDelete,
      onRequirementsChange,
      onEntrypointChange,
    },
    ref,
  ) => {
    // Keep the tab order
    const [tabFileNames, setTabFileNames] = useState<string[]>(
      Object.keys(appData.files),
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
      [appData, tabFileNames],
    );
    const [currentFileName, setCurrentFileName] = useState<string | null>(
      fileNames.length > 0 ? fileNames[0] : null,
    );

    const currentFile =
      typeof currentFileName === "string"
        ? appData.files[currentFileName]
        : null;

    const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
    const monacoRef = useRef<any>(null);
    const registeredProviderRef = useRef<IDisposable>();

    const handleEditorDitMount = useCallback<OnMount>(
      (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        registeredProviderRef.current =
          monaco.languages.registerCompletionItemProvider(
            "python",
            new CodeCompletionProvider(codeCompleter),
          );
      },
      [codeCompleter],
    );

    useEffect(() => {
      return () => {
        const monaco = monacoRef.current;
        if (monaco) {
          // Clear all the existing models. Ref: https://stackoverflow.com/a/62466612/13103190
          // If we don't do it, the previous content will remain after changing the sample apps.
          monaco.editor.getModels().forEach((model: any) => model.dispose());
        }

        // Unregister and dispose all monaco language providers
        if (registeredProviderRef.current) {
          registeredProviderRef.current.dispose();
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
      [onFileWrite, currentFileName],
    );

    const [addedFileName, setAddedFileName] = useState<string>();
    const focusTabNext = useCallback((fileName: string) => {
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
      [onFileWrite, focusTabNext],
    );

    const handleFileDelete = useCallback(
      (fileName: string) => {
        const confirmed = window.confirm(`Delete ${fileName}?`);
        if (!confirmed) {
          return;
        }

        onFileDelete(fileName);
        setTabFileNames((cur) => cur.filter((f) => f !== fileName));
      },
      [onFileDelete],
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
      [appData.requirements],
    );

    useImperativeHandle(
      ref,
      () => ({
        addRequirements: (additionalRequirements) => {
          const monaco = monacoRef.current;
          if (monaco == null) {
            return;
          }

          // Handle Monaco Editor's model directly imperatively to update the value. Ref: https://github.com/suren-atoyan/monaco-react/blob/v4.6.0/src/utils/index.ts#L21
          const uri = monaco.Uri.parse(REQUIREMENTS_FILENAME);
          const model =
            monaco.editor.getModel(uri) ??
            monaco.editor.createModel(
              defaultRequirementsTextValue,
              "text",
              uri,
            );

          const curValue = model.getValue();
          const newLineNeeded = curValue !== "" && !curValue.endsWith("\n");
          const newValue =
            curValue +
            (newLineNeeded ? "\n" : "") +
            additionalRequirements.join("\n");

          model.setValue(newValue);
        },
      }),
      [defaultRequirementsTextValue],
    );

    const isDarkMode = useDarkMode();

    return (
      <div className={styles.container}>
        <ResizableHeader
          resizableArea={
            <TabBar>
              {fileNames.map((fileName) => {
                const isEntrypoint = fileName === appData.entrypoint;
                return (
                  <Tab
                    key={fileName}
                    isEntrypoint={isEntrypoint}
                    selected={fileName === currentFileName}
                    fileNameEditable
                    initInEditingModeIfSelected={fileName === addedFileName}
                    fileName={fileName}
                    onSelect={() => setCurrentFileName(fileName)}
                    onDelete={
                      !isEntrypoint
                        ? () => handleFileDelete(fileName)
                        : undefined
                    }
                    onFileNameChange={(newPath) => {
                      onFileRename(fileName, newPath);
                      setTabFileNames((cur) =>
                        cur.map((f) => (f === fileName ? newPath : f)),
                      );
                      if (fileName === currentFileName) {
                        setCurrentFileName(newPath);
                      }
                      if (isEntrypoint) {
                        onEntrypointChange(newPath);
                      }
                    }}
                    onEntrypointSet={
                      !isEntrypoint && fileName.endsWith(".py")
                        ? () => {
                            onEntrypointChange(fileName);
                          }
                        : undefined
                    }
                  />
                );
              })}
              <div className={styles.controlButtonGroup}>
                <AddButton onClick={handleCreateFile} />
                <FileUploader onUpload={handleFileUpload} />
                {isDirectoryUploadSupported && (
                  <FileUploader onUpload={handleFileUpload} directory />
                )}
              </div>

              <div className={styles.requirementsTabContainer}>
                <Tab
                  isEntrypoint={false}
                  selected={currentFileName === REQUIREMENTS_FILENAME}
                  fileNameEditable={false}
                  initInEditingModeIfSelected={false}
                  fileName={REQUIREMENTS_FILENAME}
                  onSelect={() => setCurrentFileName(REQUIREMENTS_FILENAME)}
                  onFileNameChange={() => null}
                />
              </div>
            </TabBar>
          }
          fixedFooter={
            showTextEditor && (
              <Toolbar>
                <SaveButton onClick={handleSave} />
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
                typeof currentFileName === "string"
                  ? currentFileName
                  : undefined
              }
              defaultValue={
                currentFileName === REQUIREMENTS_FILENAME
                  ? defaultRequirementsTextValue
                  : currentFile?.content?.$case === "text"
                    ? currentFile.content.text
                    : undefined
              }
              onMount={handleEditorDitMount}
              theme={isDarkMode ? "vs-dark" : "vs"}
            />
          </div>
          {currentFileName != null &&
            currentFile?.content?.$case === "data" && (
              <BinaryFileEditor
                path={currentFileName}
                data={currentFile.content.data}
                onChange={handleBinaryFileChange}
              />
            )}
        </div>
      </div>
    );
  },
);

Editor.displayName = "Editor";

export default Editor;
