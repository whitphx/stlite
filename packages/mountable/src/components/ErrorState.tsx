import React from "react";

interface ErrorStateProps {
  error: Error;
  style?: React.CSSProperties;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  style = {},
}) => {
  const defaultStyle: React.CSSProperties = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "#d32f2f",
    textAlign: "center",
    padding: "20px",
  };

  return (
    <div style={{ ...defaultStyle, ...style }}>
      <div>
        <h2>Error</h2>
        <p>{error.message}</p>
      </div>
    </div>
  );
};
