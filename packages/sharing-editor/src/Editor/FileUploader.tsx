import React, { useCallback } from "react";

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
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const buf = e.target?.result;
              if (!(buf instanceof ArrayBuffer)) {
                console.warn(
                  `Loaded file in an unexpected type: ${typeof buf}`
                );
                return;
              }

              resolve({
                name: file.name,
                type: file.type,
                data: new Uint8Array(buf),
              });
            };
            reader.readAsArrayBuffer(file);
          })
        );
      }

      Promise.all(fileReadPromises).then(onUpload);

      e.target.value = "";
    },
    [onUpload]
  );

  return <input type="file" multiple onChange={handleFileChange} />;
}

export default FileUploader;
