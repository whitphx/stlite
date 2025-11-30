import { ToastContentProps } from "react-toastify";

interface ErrorToastContentProps {
  message: string;
  error?: Error;
}

function ErrorToastContent(props: ErrorToastContentProps) {
  const injectedProps = props as ErrorToastContentProps & ToastContentProps; // ToastContentProps is injected by react-toastify

  return (
    <div style={{ width: "100%", padding: 0 }}>
      <p>{injectedProps.message}</p>
      {injectedProps.error && (
        <pre
          style={{
            width: "100%",
            padding: 0,
            overflow: "scroll",
            maxHeight: 300,
          }}
        >
          <code style={{ padding: "16px" }}>{injectedProps.error.message}</code>
        </pre>
      )}
    </div>
  );
}

export default ErrorToastContent;
