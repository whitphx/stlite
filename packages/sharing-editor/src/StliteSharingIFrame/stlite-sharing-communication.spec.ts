import { describe, it, expect, vi } from "vitest";

import { postMessageToStliteSharing } from "./stlite-sharing-communication";
import {
  ForwardMessage,
  CodeCompletionRequestMessage,
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
  } satisfies CodeCompletionRequestMessage;

  const targetOrigin = "http://localhost:3000";
  const targetWindow = {
    postMessage: vi.fn(),
  };

  it("should resolve when the message is successfully returned", async () => {
    targetWindow.postMessage.mockImplementationOnce(
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
      postMessageToStliteSharing(
        targetWindow as unknown as Window,
        message,
        targetOrigin,
      ),
    ).resolves.toEqual({
      items: [],
    });
  });

  it("should reject when there is an error", async () => {
    targetWindow.postMessage.mockImplementationOnce(
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
      postMessageToStliteSharing(
        targetWindow as unknown as Window,
        message,
        targetOrigin,
      ),
    ).rejects.toThrowError("Test Error");
  });
});
