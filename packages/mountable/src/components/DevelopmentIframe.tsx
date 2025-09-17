import React from "react";
import {
  createIframeSrc,
  getIframeStyles,
  getIframeContainerStyles,
} from "../utils/iframeUtils";

interface DevelopmentIframeProps {
  developmentPort: string;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

export const DevelopmentIframe: React.FC<DevelopmentIframeProps> = ({
  developmentPort,
  iframeRef,
}) => {
  const iframeSrc = createIframeSrc(true, developmentPort);

  console.log("🚀 Development mode detected, loading:", iframeSrc);

  return (
    <div style={getIframeContainerStyles()}>
      <iframe
        ref={iframeRef}
        src={iframeSrc}
        style={getIframeStyles()}
        title="Dune"
      />
    </div>
  );
};
