import React, { useCallback } from "react";
import FileUploaderComponent from "./components/FileUploader";
import { readArrayBuffer } from "./file";

function supportsWebkitDirectory() {
  const input = document.createElement("input");
  return "webkitdirectory" in input;
}
export const isDirectoryUploadSupported = supportsWebkitDirectory();

interface ReadFile {
  name: string;
  type: string;
  data: Uint8Array;
}

export interface FileUploaderProps {
  onUpload: (files: ReadFile[]) => void;
  directory?: boolean;
}
function FileUploader({ onUpload, directory = false }: FileUploaderProps) {
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

        const name = directory
          ? file.webkitRelativePath.split("/").slice(1).join("/") // Remove the first segment of the path to get rid of the directory name.
          : file.name;

        fileReadPromises.push(
          readArrayBuffer(file).then((arrayBuffer) => ({
            name,
            type: file.type,
            data: new Uint8Array(arrayBuffer),
          }))
        );
      }

      Promise.all(fileReadPromises).then(onUpload);

      e.target.value = "";
    },
    [onUpload, directory]
  );

  const additionalProps = directory
    ? { directory: "", webkitdirectory: "" } // Allow selecting directories. Ref: https://stackoverflow.com/a/55615518/13103190
    : { multiple: true };

  return (
    <FileUploaderComponent
      onChange={handleFileChange}
      directoryIcon={directory}
      {...additionalProps}
    />
  );
}

export default FileUploader;
