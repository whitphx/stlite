import React, { useState, useCallback } from "react";
import classNames from "classnames";
import styles from "./ResponsiveDrawer.module.scss";

interface OpenerButtonProps {
  onClick: () => void;
}
function OpenerButton(props: OpenerButtonProps) {
  return (
    <button onClick={props.onClick} className={styles.openerButton}>
      Open
    </button>
  );
}

interface ResponsiveDrawerProps {
  children: React.ReactNode;
}
function ResponsiveDrawer(props: ResponsiveDrawerProps) {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => setOpen((cur) => !cur), []);

  return (
    <div
      className={classNames(styles.container, {
        [styles.containerOpen]: open,
      })}
    >
      <OpenerButton onClick={toggleOpen} />
      {props.children}
    </div>
  );
}

export default ResponsiveDrawer;
