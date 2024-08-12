import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import ReactDOM from "react-dom";
import { AiTwotonePlaySquare } from "react-icons/ai";
import { PiDotsThreeOutlineVertical } from "react-icons/pi";
import { isValidFilePath } from "../../path";
import styles from "./Tab.module.scss";

interface FileNameFormProps {
  defaultFileName: string;
  onChange: (fileName: string) => void;
  onFinish: (fileName: string) => void;
  onCancel: () => void;
}
function FileNameForm({
  defaultFileName,
  onChange,
  onFinish,
  onCancel,
}: FileNameFormProps) {
  const [tmpFileName, setTmpFileName] = useState(defaultFileName);
  const submittable = useMemo(
    () => isValidFilePath(tmpFileName),
    [tmpFileName],
  );

  return (
    <form
      onSubmit={useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          if (submittable) {
            onFinish(tmpFileName);
          }
        },
        [submittable, onFinish, tmpFileName],
      )}
      onKeyDown={useCallback(
        (e: React.KeyboardEvent<HTMLFormElement>) => {
          if (e.key === "Escape") {
            onCancel();
          }
        },
        [onCancel],
      )}
      className={styles.fileNameForm}
    >
      <input
        type="text"
        value={tmpFileName}
        onChange={useCallback<React.ChangeEventHandler<HTMLInputElement>>(
          (e) => {
            setTmpFileName(e.target.value);
            onChange(e.target.value);
          },
          [onChange],
        )}
        onBlur={onCancel}
        ref={useCallback<React.RefCallback<HTMLInputElement>>((input) => {
          input?.focus();
        }, [])}
        className={`${styles.fileNameInput} ${
          !submittable && styles.fileNameInputError
        }`}
      />
    </form>
  );
}

const WHITESPACE = "\u00A0";
interface EditableTabBodyProps {
  fileName: string;
  shouldBeEditingByDefault: boolean;
  onFileNameChange: (fileName: string) => void;
}
function EditableTabBody({
  fileName,
  shouldBeEditingByDefault,
  onFileNameChange,
}: EditableTabBodyProps) {
  const [fileNameEditing, setFileNameEditing] = useState(
    shouldBeEditingByDefault,
  );
  const [tmpFileName, setTmpFileName] = useState(fileName);

  const startFileNameEditing = useCallback(() => setFileNameEditing(true), []);

  const handleEditFinish = useCallback(
    (fileName: string) => {
      setFileNameEditing(false);
      onFileNameChange(fileName);
    },
    [onFileNameChange],
  );

  const handleEditCancel = useCallback(() => {
    setFileNameEditing(false);
    setTmpFileName(fileName);
  }, [fileName]);

  const displayFileName = fileNameEditing ? tmpFileName : fileName;
  const displayFileNameNoSpace =
    displayFileName.length > 0 ? displayFileName : WHITESPACE;
  return (
    <span className={styles.editableTabBody}>
      <span onClick={startFileNameEditing}>{displayFileNameNoSpace}</span>
      {fileNameEditing && (
        <FileNameForm
          defaultFileName={fileName}
          onChange={setTmpFileName}
          onFinish={handleEditFinish}
          onCancel={handleEditCancel}
        />
      )}
    </span>
  );
}

interface DropdownMenuProps {
  onDelete?: () => void;
  onSetEntrypoint?: () => void;
}
function DropdownMenu(props: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> =
    useCallback((event) => {
      event.stopPropagation(); // To prevent the dropdown from closing immediately by the document click event caught by `handleClickOutside` below.
      setIsOpen((cur) => !cur);
    }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      let top = rect.bottom;
      let left = rect.left;

      const dropdownHeight = dropdownRef.current.offsetHeight;
      const dropdownWidth = dropdownRef.current.offsetWidth;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      if (top + dropdownHeight > viewportHeight) {
        top = rect.top - dropdownHeight;
      }
      if (left + dropdownWidth > viewportWidth) {
        left = viewportWidth - dropdownWidth;
      }

      setPosition({ top, left });
    }
  }, [isOpen]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
      return;
    }
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className={styles.dropdownButton}
      >
        <PiDotsThreeOutlineVertical />
      </button>
      {isOpen &&
        ReactDOM.createPortal(
          <menu
            className={styles.dropdownContent}
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
            }}
          >
            {props.onDelete && (
              <li>
                <button onClick={props.onDelete}>Delete</button>
              </li>
            )}
            {props.onSetEntrypoint && (
              <li>
                <button onClick={props.onSetEntrypoint}>
                  Set as entrypoint
                </button>
              </li>
            )}
          </menu>,
          document.body,
        )}
    </>
  );
}

interface TabProps {
  isEntrypoint: boolean;
  fileName: string;
  selected: boolean;
  fileNameEditable: boolean;
  initInEditingModeIfSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  onFileNameChange: (fileName: string) => void;
  onEntrypointSet?: () => void;
}
function Tab({
  isEntrypoint,
  fileName,
  selected,
  fileNameEditable,
  initInEditingModeIfSelected,
  onSelect,
  onDelete,
  onFileNameChange,
  onEntrypointSet,
}: TabProps) {
  return (
    <div className={styles.tab}>
      <button
        className={styles.tabButton}
        role="tab"
        aria-selected={selected}
        onClick={onSelect}
      >
        {isEntrypoint && (
          <span className={styles.entrypointIndicator}>
            <AiTwotonePlaySquare />
            <span className={styles.tooltip}>Entrypoint</span>
          </span>
        )}
        {fileNameEditable && selected ? (
          <EditableTabBody
            fileName={fileName}
            shouldBeEditingByDefault={initInEditingModeIfSelected}
            onFileNameChange={onFileNameChange}
          />
        ) : (
          fileName
        )}
      </button>
      {(onDelete || onEntrypointSet) && (
        <DropdownMenu onDelete={onDelete} onSetEntrypoint={onEntrypointSet} />
      )}
    </div>
  );
}

export default Tab;
