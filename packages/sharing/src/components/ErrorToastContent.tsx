import { ToastContentProps } from "react-toastify";
import styles from "./ErrorToastContent.module.css";

interface ErrorToastContentProps {
  message: string;
  error?: Error;
}

function ErrorToastContent(props: ErrorToastContentProps) {
  const injectedProps = props as ErrorToastContentProps & ToastContentProps; // ToastContentProps is injected by react-toastify

  return (
    <>
      <p>{injectedProps.message}</p>
      {injectedProps.error && (
        <pre className={styles.codeContainer}>
          <code>{injectedProps.error.message}</code>
        </pre>
      )}
    </>
  );
}

export default ErrorToastContent;
