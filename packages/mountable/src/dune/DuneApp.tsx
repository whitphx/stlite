import React from "react";
import { useParams } from "react-router-dom";
import { useCredentials } from "../hooks/useCredentials";
import { useIframeCommunication } from "../hooks/useIframeCommunication";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { DevelopmentIframe } from "../components/DevelopmentIframe";
import { ProductionIframe } from "../components/ProductionIframe";

export const DuneApp: React.FC = () => {
  const { appId, port: urlPort } = useParams<{
    appId?: string;
    port?: string;
  }>();

  // Check if this is a development mode URL.
  // Local development happens when we have given a port
  const isDevelopmentMode = !!urlPort;
  const developmentPort = urlPort;

  const { credentials } = useCredentials();

  // Use iframe communication hook - simplified to just pass credentials
  const { iframeRef } = useIframeCommunication(credentials, isDevelopmentMode);

  // In development mode, show loading state while waiting for credentials
  if (isDevelopmentMode && !credentials) {
    console.log("⏳ Development mode: waiting for credentials from Fusion...");
    return <LoadingState message="Waiting for credentials from Fusion..." />;
  }

  // In development mode, just load from localhost:port - no source code fetching needed
  if (isDevelopmentMode && developmentPort && credentials) {
    console.log("🚀 Development mode: credentials received, loading iframe");
    return (
      <DevelopmentIframe
        developmentPort={developmentPort}
        iframeRef={iframeRef}
      />
    );
  }

  // Production mode logic
  if (!appId) {
    return <ErrorState error={new Error("appId is required")} />;
  }

  // For production mode, we'll need to handle file caching
  // For now, show a simple iframe pointing to the app
  return (
    <ProductionIframe
      isDevelopmentMode={isDevelopmentMode}
      developmentPort={developmentPort}
      iframeRef={iframeRef}
    />
  );
};

export default DuneApp;
