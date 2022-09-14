import React, { useState, useCallback, useMemo } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
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
    [tmpFileName]
  );

  return (
    <form
      onSubmit={useCallback(
        (e) => {
          e.preventDefault();
          if (submittable) {
            onFinish(tmpFileName);
          }
        },
        [submittable, onFinish, tmpFileName]
      )}
      onKeyDown={useCallback(
        (e) => {
          if (e.key === "Escape") {
            onCancel();
          }
        },
        [onCancel]
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
          [onChange]
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
interface SelectedTabProps {
  fileName: string;
  shouldBeEditingByDefault: boolean;
  onFileNameChange: (fileName: string) => void;
}
function SelectedTab({
  fileName,
  shouldBeEditingByDefault,
  onFileNameChange,
}: SelectedTabProps) {
  const [fileNameEditing, setFileNameEditing] = useState(
    shouldBeEditingByDefault
  );
  const [tmpFileName, setTmpFileName] = useState(fileName);

  const startFileNameEditing = useCallback(() => setFileNameEditing(true), []);

  const handleEditFinish = useCallback(
    (fileName: string) => {
      setFileNameEditing(false);
      onFileNameChange(fileName);
    },
    [onFileNameChange]
  );

  const handleEditCancel = useCallback(() => {
    setFileNameEditing(false);
    setTmpFileName(fileName);
  }, [fileName]);

  const displayFileName = fileNameEditing ? tmpFileName : fileName;
  const displayFileNameNoSpace =
    displayFileName.length > 0 ? displayFileName : WHITESPACE;
  return (
    <span className={styles.selectedTab}>
      <span className={styles.selectedTabInner}>
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
    </span>
  );
}

interface DeleteButtonProps {
  onClick: () => void;
  disabled: boolean;
}
function DeleteButton(props: DeleteButtonProps) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      tabIndex={-1}
      className={styles.deleteButton}
    >
      <RiDeleteBinLine />
    </button>
  );
}

interface TabProps {
  fileName: string;
  selected: boolean;
  fileNameEditable: boolean;
  initInEditingModeIfSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onFileNameChange: (fileName: string) => void;
}

function Tab({
  fileName,
  selected,
  fileNameEditable,
  initInEditingModeIfSelected,
  onSelect,
  onDelete,
  onFileNameChange,
}: TabProps) {
  return (
    <div
      className={`${styles.tabFrame} ${selected && styles.tabFrameSelected}`}
    >
      {fileNameEditable && selected ? (
        <SelectedTab
          fileName={fileName}
          shouldBeEditingByDefault={initInEditingModeIfSelected}
          onFileNameChange={onFileNameChange}
        />
      ) : (
        <button onClick={onSelect} className={styles.tabButton}>
          {fileName}
        </button>
      )}
      <div className={styles.deleteButtonContainer}>
        <DeleteButton onClick={onDelete} disabled={!fileNameEditable} />
      </div>
    </div>
  );
}

export default Tab;
