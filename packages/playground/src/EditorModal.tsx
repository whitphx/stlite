import { useState, useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import Editor, { OnMount } from "@monaco-editor/react";

const DEFAULT_WIDTH = Math.min(600, window.innerWidth);
const DEFAULT_X = Math.min(50, (window.innerWidth - DEFAULT_WIDTH) / 2);
const DEFAULT_HEIGHT = Math.min(400, window.innerHeight - 400);

export interface FileModel {
  value: string;
  language: string;
}
export type EditorFiles = { [path: string]: FileModel };

export interface EditorModalProps {
  defaultFiles: EditorFiles;
  onFileChange: (path: string, value: string) => void;
}
function EditorModal(props: EditorModalProps) {
  const editorRef = useRef<Parameters<OnMount>[0]>(null);

  const { defaultFiles, onFileChange } = props;

  const [currentPath, setCurrentPath] = useState(Object.keys(defaultFiles)[0]);

  const currentFile = defaultFiles[currentPath];

  return (
    <Rnd
      default={{
        x: DEFAULT_X,
        y: window.innerHeight - DEFAULT_HEIGHT - 50,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
      }}
      style={{ zIndex: 99999999, position: "fixed" }}
      enableResizing={{
        left: true,
        right: true,
      }}
      cancel=".editor-container,.editor-modal-footer"
    >
      <div className="editor-modal">
        <div className="editor-modal-header">
          {Object.keys(defaultFiles).map((path) => (
            <button
              key={path}
              disabled={currentPath === path}
              onClick={() => setCurrentPath(path)}
              className="file-selector-button"
            >
              {path}
            </button>
          ))}
        </div>
        <div className="editor-container">
          <Editor
            // Multi-model API. See https://github.com/suren-atoyan/monaco-react#multi-model-editor
            path={currentPath}
            defaultValue={currentFile.value}
            defaultLanguage={currentFile.language}
            onMount={useCallback<OnMount>((editor) => {
              (editorRef as React.MutableRefObject<unknown>).current = editor;
            }, [])}
          />
        </div>

        <div className="editor-modal-footer">
          <button
            onClick={useCallback(() => {
              const editor = editorRef.current;
              if (editor == null) {
                return;
              }
              onFileChange(currentPath, editor.getValue());
            }, [currentPath, onFileChange])}
          >
            Save
          </button>

          <span className="footnote">
            See{" "}
            <a
              href="https://docs.streamlit.io/"
              target="_blank"
              rel="noreferrer"
            >
              the Streamlit documentation
            </a>{" "}
            for the usage of it.
          </span>
        </div>
      </div>
    </Rnd>
  );
}

export default EditorModal;
