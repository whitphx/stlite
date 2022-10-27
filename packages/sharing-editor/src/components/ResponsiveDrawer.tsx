import React, { useState, useCallback } from "react";
import classNames from "classnames";
import { BiMenu } from "react-icons/bi";
import styles from "./ResponsiveDrawer.module.scss";

interface OpenerButtonProps {
  onClick: () => void;
}
function OpenerButton(props: OpenerButtonProps) {
  return (
    <button onClick={props.onClick} className={styles.openerButton}>
      <BiMenu />
    </button>
  );
}

interface CloserSheetProps {
  onClick: () => void;
}
function CloserSheet(props: CloserSheetProps) {
  return <button onClick={props.onClick} className={styles.closerSheet} />;
}

interface ResponsiveDrawerProps {
  children: React.ReactNode;
}
function ResponsiveDrawer(props: ResponsiveDrawerProps) {
  const [open, setOpen] = useState(false);
  const closeButton = useCallback(() => setOpen(false), []);
  const toggleOpen = useCallback(() => setOpen((cur) => !cur), []);

  return (
    <>
      <div
        className={classNames(styles.container, {
          [styles.containerOpen]: open,
        })}
      >
        <OpenerButton onClick={toggleOpen} />
        {props.children}
      </div>
      {open && <CloserSheet onClick={closeButton} />}
    </>
  );
}

export default ResponsiveDrawer;
