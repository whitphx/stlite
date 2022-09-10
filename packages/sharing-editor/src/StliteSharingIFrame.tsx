import React, { useRef, useImperativeHandle } from "react";
import { ForwardMessage, ReplyMessage } from "@stlite/sharing-common";

export interface StliteSharingIFrameRef {
  postMessage: (msg: ForwardMessage) => Promise<void>;
}
type IFrameProps = JSX.IntrinsicElements["iframe"];
export interface StliteSharingIFrameProps extends IFrameProps {
  messageTargetOrigin: string;
}
const StliteSharingIFrame = React.forwardRef<
  StliteSharingIFrameRef,
  StliteSharingIFrameProps
>(({ messageTargetOrigin, ...iframeProps }, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // eslint-disable-next-line jsx-a11y/iframe-has-title
  return <iframe {...iframeProps} ref={iframeRef} />;
});

export default StliteSharingIFrame;
