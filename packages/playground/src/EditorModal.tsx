import { useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import Editor, { OnMount } from "@monaco-editor/react";

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 400;

export interface EditorModalProps {
  defaultValue: string;
  onChange: (value: string) => void;
}
function EditorModal(props: EditorModalProps) {
  const editorRef = useRef<Parameters<OnMount>[0]>(null);

  const { defaultValue, onChange } = props;

  return (
    <Rnd
      default={{
        x: 50,
        y: window.innerHeight - DEFAULT_HEIGHT - 50,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
      }}
      style={{ zIndex: 99999999 }}
      enableResizing={{
        left: true,
        right: true,
      }}
      cancel=".editor-container,.editor-modal-footer"
    >
      <div className="editor-modal">
        <div className="editor-modal-header">Code Editor</div>
        <div className="editor-container">
          <Editor
            defaultValue={defaultValue}
            defaultLanguage="python"
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
              onChange(editor.getValue());
            }, [onChange])}
          >
            Save
          </button>
        </div>
      </div>
    </Rnd>
  );
}

export default EditorModal;
