import { useRef, useEffect, useState } from "react";
import { MESSAGE_TYPES } from "./useCredentials";

interface Credentials {
  token: string;
  baseUrl: string;
  project: string;
  organization: string;
  fusionUrl: string;
  email?: string;
}

export const useIframeCommunication = (
  credentials: Credentials | null,
  isDevelopmentMode: boolean,
) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);

  // Listen for APP_READY message from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === MESSAGE_TYPES.APP_READY) {
        console.log("📨 Received APP_READY from iframe - iframe is ready!");
        setIframeReady(true);
      } else if (event.data?.type === MESSAGE_TYPES.REQUEST_CREDENTIALS) {
        console.log("📨 Received REQUEST_CREDENTIALS from iframe");
        if (credentials && iframeRef.current?.contentWindow) {
          console.log(
            "📤 Sending credentials in response to REQUEST_CREDENTIALS",
          );
          const message = {
            type: MESSAGE_TYPES.CREDENTIALS,
            credentials: credentials,
          };
          iframeRef.current.contentWindow.postMessage(message, "*");
        } else {
          console.log(
            "⏳ Cannot send credentials - missing credentials or iframe not ready",
          );
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [credentials]);

  // Reset iframe ready state when iframe reference changes (reload)
  useEffect(() => {
    console.log("🔄 Iframe reference changed, resetting ready state");
    setIframeReady(false);
  }, [iframeRef.current]);

  // Send credentials when iframe is ready and we have credentials
  useEffect(() => {
    console.log(
      "🔄 useEffect triggered - iframeRef:",
      !!iframeRef.current,
      "credentials:",
      !!credentials,
      "iframeReady:",
      iframeReady,
      "isDevelopmentMode:",
      isDevelopmentMode,
    );

    if (!iframeRef.current) {
      console.log("⏳ Waiting for iframe to be created...");
      return;
    }

    if (!iframeReady) {
      console.log("⏳ Waiting for iframe to send APP_READY...");
      return;
    }

    if (!credentials) {
      console.log("⏳ Waiting for credentials...");
      return;
    }

    const iframe = iframeRef.current;
    const iframeWindow = iframe.contentWindow;

    if (iframeWindow) {
      console.log(
        "🎯 Iframe is ready and we have credentials, sending them now!",
      );

      // Pass credentials to the iframe
      console.log("📤 Passing credentials to iframe");

      const message = {
        type: MESSAGE_TYPES.CREDENTIALS,
        credentials: credentials,
      };
      console.log("📤 Sending credentials message to iframe");
      iframeWindow.postMessage(message, "*");
      console.log("📤 Credentials message sent to iframe");
    }
  }, [credentials, iframeReady, isDevelopmentMode]);

  return { iframeRef };
};
