import type { ForwardMessage, ReplyMessage } from "@stlite/sharing-common";

export const postMessageToStliteSharing = async (
  targetWindow: Window,
  message: ForwardMessage,
  targetOrigin: string,
): Promise<ReplyMessage> => {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel();

    channel.port1.onmessage = (event: MessageEvent<ReplyMessage>) => {
      channel.port1.close();
      const reply = event.data;
      console.debug("Received message:", reply);
      if (reply.error) {
        reject(reply.error);
      } else {
        resolve(reply);
      }
    };

    console.debug("Sending message:", message);
    targetWindow.postMessage(message, targetOrigin, [channel.port2]);
  });
};
