import React from "react";
import { RiUpload2Line } from "react-icons/ri";
import styles from "./FileUploader.module.scss";

type InputProps = JSX.IntrinsicElements["input"];
function FileUploader(props: InputProps) {
  return (
    <label className={styles.label}>
      <RiUpload2Line />
      <input type="file" {...props} className={styles.fileInput} />
    </label>
  );
}

export default FileUploader;
