import React from "react";
import styles from "./Toolbar.module.scss";

interface ToolbarProps {
  children: React.ReactNode;
}
function Toolbar(props: ToolbarProps) {
  return <div className={styles.toolbar}>{props.children}</div>;
}

export default Toolbar;
