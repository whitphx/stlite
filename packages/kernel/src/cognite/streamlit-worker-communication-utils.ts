import { OutMessage } from "../types";

export function postMessageToFusion(msg: any) {
  if (window.top) {
    window.top.postMessage(msg, "*");
  }
}
