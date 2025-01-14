import { RiUpload2Line, RiFolderUploadLine } from "react-icons/ri";
import styles from "./FileUploader.module.scss";

type InputProps = JSX.IntrinsicElements["input"];
interface FileUploaderProps extends InputProps {
  directoryIcon?: boolean;
}
function FileUploader(props: FileUploaderProps) {
  const { directoryIcon, ...inputProps } = props;
  return (
    <label className={styles.label}>
      {directoryIcon ? <RiFolderUploadLine /> : <RiUpload2Line />}
      <input type="file" {...inputProps} className={styles.fileInput} />
    </label>
  );
}

export default FileUploader;
