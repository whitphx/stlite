import React from "react";
import {
  createIframeSrc,
  getIframeStyles,
  getIframeContainerStyles,
} from "../utils/iframeUtils";

interface ProductionIframeProps {
  isDevelopmentMode: boolean;
  developmentPort?: string;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export const ProductionIframe: React.FC<ProductionIframeProps> = ({
  isDevelopmentMode,
  developmentPort,
  iframeRef,
}) => {
  const iframeSrc = createIframeSrc(isDevelopmentMode, developmentPort);

  console.log("📁 Production mode detected, loading from service worker");

  return (
    <div style={getIframeContainerStyles()}>
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        style={getIframeStyles()}
        title="Static HTML App"
      />
    </div>
  );
};
