import React from "react";
import { RiAddLine } from "react-icons/ri";
import styles from "./AddButton.module.scss";

interface AddButtonProps {
  onClick: () => void;
}
function AddButton(props: AddButtonProps) {
  return (
    <button onClick={props.onClick} className={styles.button}>
      <RiAddLine />
    </button>
  );
}

export default AddButton;
