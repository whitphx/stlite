import React, { useState, useRef, useCallback, useMemo } from "react";
import { RiExternalLinkLine, RiClipboardLine } from "react-icons/ri";
import styles from "./PreviewToolBar.module.scss";
import logo from "../logo.svg";

interface UrlDisplayProps {
  url: string;
}
function UrlDisplay(props: UrlDisplayProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const copiedFlagTimerRef = useRef<NodeJS.Timeout | undefined>();
  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(props.url).then(() => {
      copiedFlagTimerRef.current && clearTimeout(copiedFlagTimerRef.current);
      setCopied(true);
      (copiedFlagTimerRef as React.MutableRefObject<NodeJS.Timeout>).current =
        setTimeout(() => setCopied(false), 3000);
    });
    inputRef.current?.select(); // Not necessary, but for UX.
  }, [props.url]);

  const byteLength = useMemo(
    () => new TextEncoder().encode(props.url).length,
    [props.url]
  );

  return (
    <div className={styles.urlDisplay}>
      <label>
        URL:&nbsp;
        <input ref={inputRef} defaultValue={props.url} readOnly />
      </label>
      <div className={styles.clipboardButtonContainer}>
        <button onClick={copyToClipboard} className={styles.clipboardButton}>
          <RiClipboardLine />
        </button>
        {copied && (
          <span className={styles.copiedToastContainer}>
            <span className={styles.copiedToast}>Copied</span>
          </span>
        )}
      </div>
      <span className={styles.displayBytes}>{byteLength} bytes</span>
    </div>
  );
}

interface PreviewToolBarProps {
  sharingUrl: string;
}
function PreviewToolBar(props: PreviewToolBarProps) {
  return (
    <div className={styles.container}>
      <div>
        <a href={props.sharingUrl} target="_blank" rel="noreferrer">
          <RiExternalLinkLine />
          Open App
        </a>

        <UrlDisplay url={props.sharingUrl} />
      </div>

      <img src={logo} alt="stlite sharing logo" className={styles.logo} />
    </div>
  );
}

export default PreviewToolBar;
