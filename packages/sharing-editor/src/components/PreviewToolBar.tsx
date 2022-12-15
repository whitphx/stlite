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

function ShareIcon() {
  return (
    <span className={styles.shareIconContainer}>
      {/* Set the gradient to the icon. Ref https://github.com/react-icons/react-icons/issues/251#issuecomment-738119416 */}
      <svg width="0" height="0">
        <linearGradient
          id="share-icon-gradient"
          x1="0"
          y1="0"
          x2="100%"
          y2="100%"
        >
          <stop stopColor="rgb(255, 127, 127)" offset="0%" />
          <stop stopColor="rgb(244, 75, 75)" offset="80%" />
          <stop stopColor="rgb(173, 74, 82)" offset="100%" />
        </linearGradient>
      </svg>
      <svg viewBox="0 0 32 32" className={styles.shareIconSquare}>
        <rect
          width={28}
          height={28}
          x={2}
          y={2}
          strokeWidth={2}
          rx={4}
          ry={4}
          fill="rgba(0,0,0,0)"
          stroke="url(#share-icon-gradient)"
        />
      </svg>
      <RiShareLine
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fill: "url(#share-icon-gradient)",
        }}
      />
    </span>
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
            <ShareIcon />
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
                  <ExternalLink href="https://github.com/whitphx/stlite/blob/main/packages/desktop/README.md">
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
