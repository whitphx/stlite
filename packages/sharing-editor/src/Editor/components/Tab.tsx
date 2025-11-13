import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import ReactDOM from "react-dom";
import { AiTwotonePlaySquare, AiOutlineDelete } from "react-icons/ai";
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleButtonClick: React.MouseEventHandler<HTMLButtonElement> =
    useCallback((event) => {
      event.stopPropagation(); // To prevent the dropdown from closing immediately by the document click event caught by `handleClickOutside` below.
      setIsOpen((cur) => !cur);
    }, []);

  const dropdownRefCallback: React.RefCallback<HTMLDivElement> = useCallback(
    (dropdownEl) => {
      dropdownRef.current = dropdownEl;

      if (dropdownEl == null || buttonRef.current == null) {
        return;
      }

      const rect = buttonRef.current.getBoundingClientRect();
      let top = rect.bottom;
      let right = window.innerWidth - rect.right;

      const dropdownHeight = dropdownEl.offsetHeight;
      const dropdownWidth = dropdownEl.offsetWidth;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      if (top + dropdownHeight > viewportHeight) {
        top = rect.top - dropdownHeight;
      }
      if (right + dropdownWidth > viewportWidth) {
        right = viewportWidth - dropdownWidth;
      }

      dropdownEl.style.top = `${top}px`;
      dropdownEl.style.right = `${right}px`;
    },
    [],
  );

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
            ref={dropdownRefCallback}
            style={{
              position: "absolute",
            }}
          >
            {props.onDelete && (
              <li>
                <button onClick={props.onDelete}>
                  <AiOutlineDelete />
                  Delete
                </button>
              </li>
            )}
            {props.onSetEntrypoint && (
              <li>
                <button onClick={props.onSetEntrypoint}>
                  <AiTwotonePlaySquare />
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
