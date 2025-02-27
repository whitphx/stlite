import { describe, it, expect, vi } from "vitest";

import { postMessageToStliteSharing } from "./stlite-sharing-communication";
import {
  ForwardMessage,
  LanguageServerCodeCompletionMessage,
  LanguageServerCodeCompletionReplyMessage,
  ReplyMessage,
} from "@stlite/sharing-common";

describe("postMessageToStliteSharing", () => {
  const message = {
    type: "language-server:code_completion",
    data: {
      code: 'print("Hello")',
      currentLine: 'print("Hello")',
      currentLineNumber: 1,
      offset: 5,
    },
  } as LanguageServerCodeCompletionMessage;

  const stliteSharingOrigin = "http://localhost:3000";
  const postMessageMockFn = vi.fn();
  const stliteIframe = {
    contentWindow: {
      postMessage: postMessageMockFn,
    },
  } as unknown as HTMLIFrameElement;
  it("should resolve when the message is successful", async () => {
    const replyMessage = {
      type: "reply:language-server:code_completion",
      data: {
        items: [],
      },
    } as LanguageServerCodeCompletionReplyMessage;

    postMessageMockFn.mockImplementationOnce(
      (_message: ForwardMessage, _origin: string, options: unknown[]) => {
        const port = options[0] as MessagePort;
        setTimeout(() => {
          port.postMessage(replyMessage);
        }, 0);
      },
    );

    await expect(
      postMessageToStliteSharing(stliteIframe, message, stliteSharingOrigin),
    ).resolves.toEqual(replyMessage);
  });
  it("should reject when there is an error", async () => {
    const replyMessage = {
      type: "reply",
      error: new Error("Test Error"),
    } as ReplyMessage;

    // Mock the postMessage implementation to trigger onmessage
    postMessageMockFn.mockImplementationOnce(
      (_message: ForwardMessage, _origin: string, options: unknown[]) => {
        const port = options[0] as MessagePort;
        setTimeout(() => {
          port.postMessage(replyMessage);
        }, 0);
      },
    );
    await expect(
      postMessageToStliteSharing(stliteIframe, message, stliteSharingOrigin),
    ).rejects.toThrowError("Test Error");
  });

  it("should throw an error when target window is not ready", async () => {
    const brokenIframeRef = {
      contentWindow: null,
    } as unknown as HTMLIFrameElement;

    await expect(
      postMessageToStliteSharing(brokenIframeRef, message, stliteSharingOrigin),
    ).rejects.toThrow("The target iframe window is not ready");
  });
});
