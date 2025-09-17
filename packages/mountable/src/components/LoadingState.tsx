import React from "react";

interface LoadingStateProps {
  message?: string;
  style?: React.CSSProperties;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
  style = {},
}) => {
  const defaultStyle: React.CSSProperties = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    color: "#666",
  };

  return <div style={{ ...defaultStyle, ...style }}>{message}</div>;
};
