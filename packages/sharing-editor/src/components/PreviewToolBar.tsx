import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  RiExternalLinkLine,
  RiClipboardLine,
  RiShareLine,
} from "react-icons/ri";
import styles from "./PreviewToolBar.module.scss";

interface ExternalLinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
}
function ExternalLink({ href, children, ...restProps }: ExternalLinkProps) {
  return (
    <a href={href} {...restProps} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

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
      <input ref={inputRef} defaultValue={props.url} readOnly />
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
      <span className={styles.displayBytes}>({byteLength} bytes)</span>
      <ExternalLink href={props.url} className={styles.openAppLink}>
        Open App
        <RiExternalLinkLine />
      </ExternalLink>
    </div>
  );
}

interface PreviewToolBarProps {
  sharingUrl: string;
}
function PreviewToolBar(props: PreviewToolBarProps) {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <div className={styles.card}>
          <div className={styles.cardHeading}>
            <RiShareLine />
          </div>
          <div className={styles.cardItem}>
            <h3 className={styles.cardItemHeading}>Web</h3>
            <UrlDisplay url={props.sharingUrl} />
          </div>
          <div className={styles.cardExpandableItemsContainer}>
            <div className={styles.cardItem}>
              <h3 className={styles.cardItemHeading}>PWA/Custom domains</h3>
              Coming Soon...
            </div>
            <div className={styles.cardItem}>
              <h3 className={styles.cardItemHeading}>Self-hosting Web/PWA</h3>
              <ul>
                <li>Codegen: Coming Soon...</li>
                <li>
                  Manual: Read{" "}
                  <ExternalLink href="https://github.com/whitphx/stlite#use-stlite-on-your-web-page">
                    this document
                    <RiExternalLinkLine />
                  </ExternalLink>
                </li>
              </ul>
            </div>
            <div className={styles.cardItem}>
              <h3 className={styles.cardItemHeading}>Desktop app</h3>
              <ul>
                <li>Online bundler: Coming Soon...</li>
                <li>
                  Manual: Read{" "}
                  <ExternalLink href="https://github.com/whitphx/stlite/blob/main/packages/desktop-cli/README.md">
                    this document
                    <RiExternalLinkLine />
                  </ExternalLink>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewToolBar;
