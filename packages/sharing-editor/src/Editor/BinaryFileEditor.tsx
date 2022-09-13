import React, { useCallback, useMemo } from "react";
import mime from "mime";
import styles from "./BinaryFileEditor.module.scss";
import { readArrayBuffer } from "./file";

interface PreviewProps {
  path: string;
  data: Uint8Array;
}
function Preview(props: PreviewProps) {
  const mimeType = useMemo(() => mime.getType(props.path), [props.path]);
  const dataUrl = useMemo(() => {
    const blob = new Blob([props.data]);
    return URL.createObjectURL(blob);
  }, [props.data]);

  if (mimeType?.startsWith("image")) {
    return (
      <img
        src={dataUrl}
        alt={`Preview of ${props.path}`}
        className={styles.image}
      />
    );
  }
  if (mimeType?.startsWith("video")) {
    return <video src={dataUrl} className={styles.image} controls />;
  }
  if (mimeType?.startsWith("audio")) {
    return <audio src={dataUrl} controls />;
  }

  return <p>No Preview</p>;
}

interface BinaryFileEditorProps {
  path: string;
  data: Uint8Array;
  onChange: (data: Uint8Array) => void;
}
function BinaryFileEditor(props: BinaryFileEditorProps) {
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
    <div className={styles.container}>
      <p>
        {props.path} ({props.data.byteLength} bytes)
      </p>
      <div className={styles.mediaContainer}>
        <Preview path={props.path} data={props.data} />
      </div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}

export default BinaryFileEditor;
