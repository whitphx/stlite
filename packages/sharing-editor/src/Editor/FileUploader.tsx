import React, { useCallback } from "react";
import { readArrayBuffer } from "./file";
import { RiUpload2Line } from "react-icons/ri";
import styles from "./FileUploader.module.scss";

interface ReadFile {
  name: string;
  type: string;
  data: Uint8Array;
}

export interface FileUploaderProps {
  onUpload: (files: ReadFile[]) => void;
}
function FileUploader({ onUpload }: FileUploaderProps) {
  const handleFileChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (e) => {
      if (e.target.files == null) {
        return;
      }

      const fileReadPromises: Promise<ReadFile>[] = [];
      for (let idx = 0; idx < e.target.files.length; ++idx) {
        const file = e.target.files[idx];

        fileReadPromises.push(
          readArrayBuffer(file).then((arrayBuffer) => ({
            name: file.name,
            type: file.type,
            data: new Uint8Array(arrayBuffer),
          }))
        );
      }

      Promise.all(fileReadPromises).then(onUpload);

      e.target.value = "";
    },
    [onUpload]
  );

  return (
    <label className={styles.label}>
      <RiUpload2Line />
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className={styles.fileInput}
      />
    </label>
  );
}

export default FileUploader;
