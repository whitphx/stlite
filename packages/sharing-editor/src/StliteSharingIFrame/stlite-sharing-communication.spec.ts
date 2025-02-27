import { describe, it, expect, vi } from "vitest";

import { postMessageToStliteSharing } from "./stlite-sharing-communication";
import {
  ForwardMessage,
  LanguageServerCodeCompletionMessage,
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

  const targetOrigin = "http://localhost:3000";
  const postMessageMockFn = vi.fn();
  const targetWindow = {
    postMessage: postMessageMockFn,
  } as unknown as Window;
  it("should resolve when the message is successfully returned", async () => {
    postMessageMockFn.mockImplementationOnce(
      (_message: ForwardMessage, _origin: string, options: unknown[]) => {
        const port = options[0] as MessagePort;
        setTimeout(() => {
          port.postMessage({
            type: "reply:language-server:code_completion",
            data: {
              items: [],
            },
          });
        }, 0);
      },
    );

    await expect(
      postMessageToStliteSharing(targetWindow, message, targetOrigin),
    ).resolves.toEqual({
      type: "reply:language-server:code_completion",
      data: {
        items: [],
      },
    });
  });
  it("should reject when there is an error", async () => {
    // Mock the postMessage implementation to trigger onmessage
    postMessageMockFn.mockImplementationOnce(
      (_message: ForwardMessage, _origin: string, options: unknown[]) => {
        const port = options[0] as MessagePort;
        setTimeout(() => {
          port.postMessage({
            type: "reply",
            error: new Error("Test Error"),
          });
        }, 0);
      },
    );
    await expect(
      postMessageToStliteSharing(targetWindow, message, targetOrigin),
    ).rejects.toThrowError("Test Error");
  });
});
