import React, { useState, useCallback } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
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

  return (
    <form
      onSubmit={useCallback(
        (e) => {
          e.preventDefault();
          onFinish(tmpFileName);
        },
        [onFinish, tmpFileName]
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
        className={styles.fileNameInput}
      />
    </form>
  );
}

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

  return (
    <span className={styles.selectedTab}>
      <span onClick={startFileNameEditing}>
        {fileNameEditing ? tmpFileName : fileName}
      </span>
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

interface DeleteButtonProps {
  onClick: () => void;
}
function DeleteButton(props: DeleteButtonProps) {
  return (
    <button tabIndex={-1} className={styles.deleteButton}>
      <RiDeleteBinLine onClick={props.onClick} />
    </button>
  );
}

interface TabProps {
  fileName: string;
  selected: boolean;
  initInEditingModeIfSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onFileNameChange: (fileName: string) => void;
}

function Tab({
  fileName,
  selected,
  initInEditingModeIfSelected,
  onSelect,
  onDelete,
  onFileNameChange,
}: TabProps) {
  return (
    <span
      className={`${styles.tabFrame} ${selected && styles.tabFrameSelected}`}
    >
      {selected ? (
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
      <DeleteButton onClick={onDelete} />
    </span>
  );
}

export default Tab;
