import React, { useState, useCallback } from "react";
import styles from "./Tab.module.css";

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

  const handleInputChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >((e) => {
    setTmpFileName(e.target.value);
  }, []);

  const completeEditing = useCallback(() => {
    if (tmpFileName.trim() === "") {
      setFileNameEditing(false);
      return;
    }
    setFileNameEditing(false);
    onFileNameChange(tmpFileName);
  }, [tmpFileName, onFileNameChange]);
  const cancelEditing = useCallback(() => {
    setTmpFileName(fileName);
    setFileNameEditing(false);
  }, [fileName]);

  const onInputMount = useCallback<React.RefCallback<HTMLInputElement>>(
    (input) => {
      input?.focus();
    },
    []
  );

  return (
    <span className={styles.selectedTab}>
      <span onClick={startFileNameEditing}>
        {fileNameEditing ? tmpFileName : fileName}
      </span>
      {fileNameEditing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            completeEditing();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              cancelEditing();
            }
          }}
          className={styles.fileNameForm}
        >
          <input
            type="text"
            value={tmpFileName}
            onChange={handleInputChange}
            onBlur={completeEditing}
            ref={onInputMount}
            className={styles.fileNameInput}
          />
        </form>
      )}
    </span>
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
    <span>
      {selected ? (
        <SelectedTab
          fileName={fileName}
          shouldBeEditingByDefault={initInEditingModeIfSelected}
          onFileNameChange={onFileNameChange}
        />
      ) : (
        <button onClick={onSelect}>{fileName}</button>
      )}
      <button onClick={onDelete}>x</button>
    </span>
  );
}

export default Tab;
