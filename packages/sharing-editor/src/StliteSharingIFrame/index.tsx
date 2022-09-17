import React, { useRef, useMemo, useImperativeHandle } from "react";
import {
  AppData,
  embedAppDataToUrl,
  ForwardMessage,
  ReplyMessage,
} from "@stlite/sharing-common";
import { ALLOWED_FEATURE_POLICY } from "./policy";

export interface StliteSharingIFrameRef {
  postMessage: (msg: ForwardMessage) => Promise<void>;
}
type IFrameProps = JSX.IntrinsicElements["iframe"];
export interface StliteSharingIFrameProps extends Omit<IFrameProps, "src"> {
  sharingAppSrc: string;
  initialAppData: AppData;
  messageTargetOrigin: string;
}
const StliteSharingIFrame = React.forwardRef<
  StliteSharingIFrameRef,
  StliteSharingIFrameProps
>(
  (
    { sharingAppSrc, initialAppData, messageTargetOrigin, ...iframeProps },
    ref
  ) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const iframeSrc = useMemo(
      () => embedAppDataToUrl(sharingAppSrc, initialAppData),
      // NOTE: `iframeSrc` should be calculated only for the initial `appData` and be persistent.
      // Subsequential changes should be applied via `ref.postMessage()` as imperative operations.
      // So `initialAppData` is excluded from the deps below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [sharingAppSrc]
    );

    useImperativeHandle(
      ref,
      () => ({
        postMessage(message) {
          return new Promise((resolve, reject) => {
            const targetWindow = iframeRef.current?.contentWindow;
            if (targetWindow == null) {
              throw new Error(`The target iframe window is not ready`);
            }

            const channel = new MessageChannel();

            channel.port1.onmessage = (e: MessageEvent<ReplyMessage>) => {
              channel.port1.close();
              const reply = e.data;
              if (reply.error) {
                reject(reply.error);
              } else {
                resolve();
              }
            };

            targetWindow.postMessage(message, messageTargetOrigin, [
              channel.port2,
            ]);
          });
        },
      }),
      [messageTargetOrigin]
    );

    return (
      // eslint-disable-next-line jsx-a11y/iframe-has-title
      <iframe
        {...iframeProps}
        src={iframeSrc}
        ref={iframeRef}
        allow={ALLOWED_FEATURE_POLICY}
      />
    );
  }
);

export default StliteSharingIFrame;
