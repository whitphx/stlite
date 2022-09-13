import React, { useCallback, useMemo } from "react";
import styles from "./BinaryFileEditor.module.scss";
import { readArrayBuffer } from "./file";

interface BinaryFileEditorProps {
  path: string;
  data: Uint8Array;
  onChange: (data: Uint8Array) => void;
}
function BinaryFileEditor(props: BinaryFileEditorProps) {
  const dataUrl = useMemo(() => {
    const blob = new Blob([props.data]);
    return URL.createObjectURL(blob);
  }, [props.data]);

  const onChange = props.onChange;
  const handleFileChange = useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (e) => {
      if (e.target.files == null) {
        return;
      }
      const file = e.target.files[0];
      readArrayBuffer(file).then((arrayBuffer) => {
        onChange(new Uint8Array(arrayBuffer));
      });
    },
    [onChange]
  );

  return (
    <div>
      <p>
        {props.path} ({props.data.byteLength} bytes)
      </p>
      <img
        src={dataUrl}
        alt={`Preview of ${props.path}`}
        className={styles.image}
      />
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}

export default BinaryFileEditor;
