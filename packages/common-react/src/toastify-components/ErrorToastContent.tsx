import React from "react";
import { ToastContentProps } from "react-toastify";

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
        <pre
          style={{
            overflow: "scroll",
            maxHeight: 300,
          }}
        >
          <code>{injectedProps.error.message}</code>
        </pre>
      )}
    </>
  );
}

export default ErrorToastContent;
