import { useState, useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import Editor, { OnMount } from "@monaco-editor/react";

const DEFAULT_WIDTH = Math.min(600, window.innerWidth);
const DEFAULT_X = Math.min(50, (window.innerWidth - DEFAULT_WIDTH) / 2);
const DEFAULT_HEIGHT = Math.min(400, window.innerHeight - 400);

const TABS = ["code", "requirements"] as const;

interface RadioGroupProps<T extends string = string> {
  name: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}
function RadioGroup<T extends string = string>({
  name,
  onChange,
  value: currentValue,
  options,
}: RadioGroupProps<T>) {
  const onClick = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      onChange(e.target.value as T);
    },
    [onChange]
  );
  return (
    <>
      {options.map((value) => (
        <label key={value} className="radio-label">
          <input
            type="radio"
            className="radio-radio"
            name={name}
            value={value}
            checked={value === currentValue}
            onChange={onClick}
          />
          {value}
        </label>
      ))}
    </>
  );
}

export interface EditorModalProps {
  defaultValue: string;
  onChange: (value: string) => void;
  defaultRequirementsValue: string;
  onInstallRequired: (requirements: string[]) => void;
}
function EditorModal(props: EditorModalProps) {
  const [tab, setTab] = useState<typeof TABS[number]>("code");

  const editorRef = useRef<Parameters<OnMount>[0]>(null);

  const { defaultValue, onChange, onInstallRequired } = props;

  const requirementsTextRef = useRef<HTMLTextAreaElement>(null);

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
          <RadioGroup name="tab" value={tab} options={TABS} onChange={setTab} />
        </div>
        <div className="editor-container" hidden={tab !== "code"}>
          <Editor
            defaultValue={defaultValue}
            defaultLanguage="python"
            onMount={useCallback<OnMount>((editor) => {
              (editorRef as React.MutableRefObject<unknown>).current = editor;
            }, [])}
          />
        </div>

        <div className="editor-container" hidden={tab !== "requirements"}>
          <textarea
            className="requirements-textarea"
            defaultValue={props.defaultRequirementsValue}
            ref={requirementsTextRef}
          />
        </div>

        <div className="editor-modal-footer">
          <button
            hidden={tab !== "code"}
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
          <button
            hidden={tab !== "requirements"}
            onClick={useCallback(() => {
              const value = requirementsTextRef.current?.value || "";
              const requirements = value
                .split("\n")
                .map((r) => r.trim())
                .filter((r) => r !== "");
              onInstallRequired(requirements);
            }, [onInstallRequired])}
          >
            Install
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
