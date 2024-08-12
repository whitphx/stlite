import { useMemo } from "react";
import TextLineDisplay from "./TextLineDisplay";
import styles from "./UrlDisplay.module.scss";

interface UrlDisplayProps {
  url: string;
}
function UrlDisplay(props: UrlDisplayProps) {
  const byteLength = useMemo(
    () => new TextEncoder().encode(props.url).length,
    [props.url],
  );

  return (
    <div className={styles.container}>
      <TextLineDisplay text={props.url} />
      <span className={styles.displayBytes}>({byteLength} bytes)</span>
    </div>
  );
}

export default UrlDisplay;
