import { useState, useEffect } from "react";

interface Credentials {
  token: string;
  baseUrl: string;
  project: string;
  organization: string;
  fusionUrl: string;
  email?: string;
}

export const MESSAGE_TYPES = {
  APP_HOST_READY: "APP_HOST_READY",
  APP_READY: "APP_READY",
  CREDENTIALS: "CREDENTIALS",
  REQUEST_CREDENTIALS: "REQUEST_CREDENTIALS",
} as const;

export const useCredentials = () => {
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  // Send ready signal to Fusion when component mounts
  useEffect(() => {
    console.log("🚀 App is ready, sending ready signal to Fusion");
    window.parent.postMessage({ type: MESSAGE_TYPES.APP_HOST_READY }, "*");
  }, []);

  // Listen for messages from parent application (Fusion)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Filter out noise messages from setImmediate
      if (
        typeof event.data === "string" &&
        event.data.startsWith("setImmediate")
      ) {
        return;
      }

      // Ignore messages from iframe (REQUEST_CREDENTIALS, APP_READY, etc.)
      if (
        event.data?.type === MESSAGE_TYPES.REQUEST_CREDENTIALS ||
        event.data?.type === MESSAGE_TYPES.APP_READY
      ) {
        return;
      }

      // Check if this is a credentials message from Fusion
      if (
        event.data &&
        typeof event.data === "object" &&
        event.data.token &&
        event.data.baseUrl &&
        event.data.project &&
        event.data.organization &&
        event.data.fusionUrl
      ) {
        console.log("✅ Received credentials from Fusion");

        setCredentials({
          token: event.data.token,
          baseUrl: event.data.baseUrl,
          project: event.data.project,
          organization: event.data.organization,
          fusionUrl: event.data.fusionUrl,
          email: event.data.email,
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return { credentials };
};
