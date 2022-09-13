import React, { useCallback } from "react";
import FileUploaderComponent from "./components/FileUploader";
import { readArrayBuffer } from "./file";

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

  return <FileUploaderComponent onChange={handleFileChange} multiple />;
}

export default FileUploader;
