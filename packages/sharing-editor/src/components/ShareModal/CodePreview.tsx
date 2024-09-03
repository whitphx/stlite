import React, { useCallback, useRef } from "react";
import { RiClipboardLine, RiDownloadLine } from "react-icons/ri";
import styles from "./CodePreview.module.scss";

interface CodePreviewProps {
  children: string;
}
function CodePreview(props: CodePreviewProps) {
  const htmlSource = props.children;

  // Select all the HTML code upon double clicks
  const codeRef = useRef<HTMLElement>(null);
  const handleCodeDoubleClick = useCallback<React.MouseEventHandler>(() => {
    const codeElem = codeRef.current;
    if (codeElem == null) {
      return;
    }
    const range = document.createRange();
    range.selectNodeContents(codeElem);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, []);

  const handleCopyButtonClick = useCallback<React.MouseEventHandler>(() => {
    navigator.clipboard.writeText(htmlSource);
  }, [htmlSource]);

  const handleDownloadButtonClick = useCallback<React.MouseEventHandler>(() => {
    const anchorElem = window.document.createElement("a");
    anchorElem.setAttribute(
      "href",
      "data:text/html;charset=utf-8," + encodeURIComponent(htmlSource)
    );
    anchorElem.setAttribute("download", "stlite.html");
    anchorElem.click();
    anchorElem.remove();
  }, [htmlSource]);

  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        <button onClick={handleCopyButtonClick}>
          <RiClipboardLine />
        </button>
        <button onClick={handleDownloadButtonClick}>
          <RiDownloadLine />
        </button>
      </div>
      <div className={styles.codeBox} onDoubleClick={handleCodeDoubleClick}>
        <pre>
          <code ref={codeRef}>{htmlSource}</code>
        </pre>
      </div>
    </div>
  );
}

export default CodePreview;
