import { useRef, useCallback } from "react";
import { Rnd } from "react-rnd";

export interface EditorProps {
  defaultValue: string;
  onChange: (value: string) => void;
}
function Editor(props: EditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const { defaultValue, onChange } = props;

  return (
    <Rnd
      default={{ x: 0, y: 0, width: 320, height: 300 }}
      style={{ zIndex: 99999999 }}
    >
      <div className="editor-container">
        <textarea defaultValue={defaultValue} ref={editorRef} />
        <button
          onClick={useCallback(() => {
            const editorElem = editorRef.current;
            if (editorElem == null) {
              return;
            }
            onChange(editorElem.value);
          }, [onChange])}
        >
          Save
        </button>
      </div>
    </Rnd>
  );
}

export default Editor;
