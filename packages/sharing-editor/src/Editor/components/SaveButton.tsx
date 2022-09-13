import React from "react";
import { RiSave3Line } from "react-icons/ri";
import styles from "./SaveButton.module.scss";

interface SaveButtonProps {
  onClick: () => void;
}
function SaveButton(props: SaveButtonProps) {
  return (
    <button onClick={props.onClick} className={styles.button}>
      <RiSave3Line className={styles.icon} />
      Save
    </button>
  );
}

export default SaveButton;
