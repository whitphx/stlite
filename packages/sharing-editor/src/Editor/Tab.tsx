import React, { useState, useRef } from "react";
import styles from "./Tab.module.css";

interface FileNameEditingTabProps {
  defaultFileName: string;
  onEditFinish: (fileName: string) => void;
  onEditCancel: () => void;
}
function FileNameEditingTab({
  defaultFileName,
  onEditFinish,
  onEditCancel,
}: FileNameEditingTabProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleEditFinish = () => {
    onEditFinish(inputRef.current?.value ?? defaultFileName);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleEditFinish();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onEditCancel();
        }
      }}
      className={styles.fileNameForm}
    >
      <input
        type="text"
        defaultValue={defaultFileName}
        onBlur={handleEditFinish}
        ref={(input) => {
          (
            inputRef as React.MutableRefObject<HTMLInputElement | null>
          ).current = input;
          if (input == null) {
            return;
          }
          input.focus();
        }}
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

  if (fileNameEditing) {
    return (
      <FileNameEditingTab
        defaultFileName={fileName}
        onEditFinish={(fileName) => {
          onFileNameChange(fileName);
          setFileNameEditing(false);
        }}
        onEditCancel={() => setFileNameEditing(false)}
      />
    );
  }

  return <span onClick={() => setFileNameEditing(true)}>{fileName}</span>;
}

interface TabProps {
  fileName: string;
  selected: boolean;
  initInEditingModeIfSelected: boolean;
  onSelect: () => void;
  onFileNameChange: (fileName: string) => void;
}

function Tab({
  fileName,
  selected,
  initInEditingModeIfSelected,
  onSelect,
  onFileNameChange,
}: TabProps) {
  if (selected) {
    return (
      <SelectedTab
        fileName={fileName}
        shouldBeEditingByDefault={initInEditingModeIfSelected}
        onFileNameChange={onFileNameChange}
      />
    );
  }

  return <button onClick={onSelect}>{fileName}</button>;
}

export default Tab;
