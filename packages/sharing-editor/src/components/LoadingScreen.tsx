import React from "react";
import { AiOutlineLoading } from "react-icons/ai";
import styles from "./LoadingScreen.module.scss";

function LoadingScreen() {
  return (
    <div className={styles.container}>
      <AiOutlineLoading className={styles.spinner} size={100} />
    </div>
  );
}

export default LoadingScreen;
