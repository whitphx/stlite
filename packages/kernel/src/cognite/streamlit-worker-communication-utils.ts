import { OutMessage } from "../types";
import type { StliteWorkerContext } from "../worker";

export function postMessageToStreamLitWorker(
  ctx: StliteWorkerContext,
  message: OutMessage
) {
  ctx.postMessage(message);
}

export function postMessageToFusion(msg: any) {
  if (window.top) {
    window.top.postMessage(msg, "*");
  }
}
