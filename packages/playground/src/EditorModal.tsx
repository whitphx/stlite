import { useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import Editor, { OnMount } from "@monaco-editor/react";

export interface EditorModalProps {
  defaultValue: string;
  onChange: (value: string) => void;
}
function EditorModal(props: EditorModalProps) {
  const editorRef = useRef<Parameters<OnMount>[0]>(null);

  const { defaultValue, onChange } = props;

  return (
    <Rnd
      default={{ x: 100, y: 200, width: 600, height: 400 }}
      style={{ zIndex: 99999999 }}
      enableResizing={{
        left: true,
        right: true,
      }}
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
