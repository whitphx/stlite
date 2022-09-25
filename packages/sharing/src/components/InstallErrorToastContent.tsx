import { ToastContentProps } from "react-toastify";
import styles from "./InstallErrorToastContent.module.css";

interface InstallErrorToastContentProps {
  error: Error;
}

function InstallErrorToastContent(props: InstallErrorToastContentProps) {
  const injectedProps = props as InstallErrorToastContentProps &
    ToastContentProps; // ToastContentProps is injected by react-toastify

  return (
    <>
      <p>Failed to install.</p>
      <pre className={styles.codeContainer}>
        <code>{injectedProps.error.message}</code>
      </pre>
    </>
  );
}

export default InstallErrorToastContent;
