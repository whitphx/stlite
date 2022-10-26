import React, { useState } from "react";
import { Resizable } from "re-resizable";
import classNames from "classnames";
import styles from "./ResponsiveSideBySidePanes.module.scss";

interface ResponsiveSideBySidePanesProps {
  left: React.ReactNode;
  right: React.ReactNode;
}
function ResponsiveSideBySidePanes(props: ResponsiveSideBySidePanesProps) {
  const [showRight, setShowRight] = useState(false);
  return (
    <div className={styles.outerContainer}>
      <div
        className={classNames(styles.transitionContainer, {
          [styles.showRight]: showRight,
        })}
      >
        <Resizable
          defaultSize={{ width: "inherit", height: "inherit" }}
          enable={{ right: true }}
          className={styles.leftResizableContainer}
        >
          {props.left}
        </Resizable>
        <div
          className={styles.divider}
          onClick={() => setShowRight((cur) => !cur)}
        />
        <div className={styles.rightContainer}>{props.right}</div>
      </div>
    </div>
  );
}

export default ResponsiveSideBySidePanes;
