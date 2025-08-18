import React, { useState, useCallback, useRef } from "react";
import { RiClipboardLine } from "react-icons/ri";
import styles from "./TextLineDisplay.module.scss";

interface TextLineDisplayProps {
  text: string;
}
function TextLineDisplay(props: TextLineDisplayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const copiedFlagTimerRef = useRef<NodeJS.Timeout | undefined>();
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(props.text).then(() => {
      if (copiedFlagTimerRef.current) {
        clearTimeout(copiedFlagTimerRef.current);
      }
      setCopied(true);
      (copiedFlagTimerRef as React.MutableRefObject<NodeJS.Timeout>).current =
        setTimeout(() => setCopied(false), 3000);
    });
    inputRef.current?.select(); // Not necessary, but for UX.
  }, [props.text]);

  return (
    <span className={styles.container}>
      <input ref={inputRef} defaultValue={props.text} readOnly />
      <span className={styles.clipboardButtonContainer}>
        <button onClick={copyToClipboard} className={styles.clipboardButton}>
          <RiClipboardLine />
        </button>
        {copied && (
          <span className={styles.copiedToastContainer}>
            <span className={styles.copiedToast}>Copied</span>
          </span>
        )}
      </span>
    </span>
  );
}

export default TextLineDisplay;
