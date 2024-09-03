import { useMemo } from "react";
import { AppData, embedAppDataToUrl } from "@stlite/sharing-common";
import UrlDisplay from "./UrlDisplay";
import CodePreview from "./CodePreview";
import { exportAsHtml } from "../../export/html";
import ExternalLink from "../ExternalLink";
import styles from "./ShareModalContent.module.scss";

interface ShareModalContentProps {
  appData: AppData;
  sharingAppSrc: string;
}
function ShareModalContent(props: ShareModalContentProps) {
  const url = useMemo(
    () => embedAppDataToUrl(props.sharingAppSrc, props.appData),
    [props.sharingAppSrc, props.appData]
  );

  const html = useMemo(
    () => (props.appData ? exportAsHtml(props.appData) : null),
    [props.appData]
  );

  return (
    <div className={styles.container}>
      {url && (
        <section className={styles.section}>
          <h3 className={styles.heading}>Stlite Sharing</h3>
          <p>
            Share this URL:
            <UrlDisplay url={url} />
          </p>
          <p>
            <ExternalLink href={url} className={styles.openAppLink}>
              Open the URL
            </ExternalLink>
          </p>
        </section>
      )}

      {html && (
        <section className={styles.section}>
          <h3 className={styles.heading}>Self-hosting</h3>
          <p>Download and share the HTML below or host it on your site.</p>
          <CodePreview>{html}</CodePreview>
          <p>
            For more information, read{" "}
            <ExternalLink href="https://github.com/whitphx/stlite?tab=readme-ov-file#use-stlite-on-your-web-page-stlitemountable">
              this document
            </ExternalLink>
          </p>
        </section>
      )}
      <section className={styles.section}>
        <h3 className={styles.heading}>Desktop app</h3>
        <p>
          Read{" "}
          <ExternalLink href="https://github.com/whitphx/stlite/blob/main/packages/desktop/README.md">
            this document
          </ExternalLink>
        </p>
      </section>
    </div>
  );
}

export default ShareModalContent;
