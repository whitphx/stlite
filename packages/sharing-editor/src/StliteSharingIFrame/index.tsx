import React, { useRef, useMemo, useImperativeHandle, useEffect } from "react";
import {
  AppData,
  embedAppDataToUrl,
  ForwardMessage,
  ReplyMessage,
} from "@stlite/sharing-common";
import { ALLOWED_FEATURE_POLICY } from "./policy";
import { postMessageToStliteSharing } from "../stlite-sharing-communication";

export interface StliteSharingIFrameRef {
  postMessage: (msg: ForwardMessage) => Promise<ReplyMessage>;
}
type IFrameProps = JSX.IntrinsicElements["iframe"];
export interface StliteSharingIFrameProps extends Omit<IFrameProps, "src"> {
  sharingAppSrc: string;
  initialAppData: AppData;
  messageTargetOrigin: string;
  theme: "light" | "dark" | null;
  sharedWorkerMode: boolean;
  onMessage: (event: MessageEvent) => void;
}
const StliteSharingIFrame = React.forwardRef<
  StliteSharingIFrameRef,
  StliteSharingIFrameProps
>(
  (
    {
      sharingAppSrc,
      initialAppData,
      messageTargetOrigin,
      onMessage,
      theme,
      sharedWorkerMode,
      ...iframeProps
    },
    ref,
  ) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const iframeSrc = useMemo(
      () => {
        const urlParams = new URLSearchParams();
        urlParams.append("languageServer", "true");
        urlParams.append("embed", "true");
        urlParams.append("embed_options", "show_toolbar");
        if (theme) {
          urlParams.append("embed_options", `${theme}_theme`);
        }
        if (sharedWorkerMode) {
          urlParams.append("sharedWorker", "true");
        }
        return embedAppDataToUrl(
          sharingAppSrc + "?" + urlParams.toString(),
          initialAppData,
        );
      },
      // NOTE: `iframeSrc` should be calculated only for the initial `appData` and be persistent.
      // Subsequential changes should be applied via `ref.postMessage()` as imperative operations.
      // So `initialAppData` is excluded from the deps below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [sharingAppSrc, theme, sharedWorkerMode],
    );

    useImperativeHandle(
      ref,
      () => ({
        postMessage: (message) => {
          return postMessageToStliteSharing(
            iframeRef.current as HTMLIFrameElement,
            message,
            messageTargetOrigin,
          );
        },
      }),
      [messageTargetOrigin],
    );

    useEffect(() => {
      const windowMessageEventListener = (event: MessageEvent) => {
        if (event.source === iframeRef.current?.contentWindow) {
          onMessage(event);
        }
      };

      window.addEventListener("message", windowMessageEventListener);
      return () => {
        window.removeEventListener("message", windowMessageEventListener);
      };
    }, [onMessage]);

    return (
      <iframe
        {...iframeProps}
        src={iframeSrc}
        ref={iframeRef}
        allow={ALLOWED_FEATURE_POLICY}
      />
    );
  },
);

StliteSharingIFrame.displayName = "StliteSharingIFrame";

export default StliteSharingIFrame;
