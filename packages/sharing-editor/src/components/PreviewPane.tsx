import React from "react";
import styles from "./PreviewPane.module.scss";

interface PreviewPaneProps {
  children: React.ReactNode;
}
function PreviewPane(props: PreviewPaneProps) {
  return <div className={styles.previewPane}>{props.children}</div>;
}

export default PreviewPane;
