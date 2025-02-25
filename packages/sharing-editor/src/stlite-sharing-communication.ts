import type { ForwardMessage, ReplyMessage } from "@stlite/sharing-common";
import { getStliteSharingURL } from "./constants";

export const postMessageToStliteSharing = async (
  stliteSharingIframe: HTMLIFrameElement,
  message: ForwardMessage,
  stliteSharingOrigin?: string,
  enableLogs = false,
): Promise<ReplyMessage> => {
  const _stliteSharingOrigin =
    stliteSharingOrigin || (await getStliteSharingURL()).origin;
  const iframe = stliteSharingIframe;
  const targetWindow = iframe.contentWindow;

  if (targetWindow === null) {
    throw new Error(`The target iframe window is not ready`);
  }

  function logMessage(
    message: string,
    messagePayload: ForwardMessage | ReplyMessage,
  ) {
    if (enableLogs) {
      console.log(message, messagePayload);
    }
  }

  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = (event: MessageEvent<ReplyMessage>) => {
      channel.port1.close();
      const reply = event.data;
      logMessage("Received message:", reply);
      if (reply.error) {
        reject(reply.error);
      } else {
        resolve(reply);
      }
    };

    logMessage("Sending message:", message);
    targetWindow.postMessage(message, _stliteSharingOrigin, [channel.port2]);
  });
};
