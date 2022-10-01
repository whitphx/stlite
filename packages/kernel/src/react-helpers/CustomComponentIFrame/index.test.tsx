import React from "react";
import { afterEach, describe, it, expect, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { StliteKernel } from "../../kernel";
import { StliteKernelProvider } from "../StliteKernelProvider";
import CustomComponentIFrame from ".";
import { manipulateIFrameDocument } from "./iframe-manipulation";

const mockIframeSrcDoc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Streamlit Custom Component</title>
</head>
<body>
  <div>Body</div>
</body>
</html>
`;

const mockHtmlResponses = {
  "/component/foo.bar/index.html": {
    contentType: "text/html",
    body: mockIframeSrcDoc,
  },
};

vi.mock("../../kernel", () => {
  const StliteKernel = vi.fn();

  StliteKernel.prototype.sendHttpRequest = vi
    .fn()
    .mockImplementation(({ path }) => {
      const htmlResponse = mockHtmlResponses[path];
      if (htmlResponse) {
        return Promise.resolve({
          statusCode: 200,
          headers: new Map([["Content-Type", htmlResponse.type]]),
          body: new TextEncoder().encode(htmlResponse.body),
        });
      } else {
        return Promise.resolve({
          statusCode: 404,
          headers: new Map(),
          body: new Uint8Array(),
        });
      }
    });

  return { StliteKernel };
});

vi.mock("./iframe-manipulation");
vi.mock("./url", async () => {
  const originalModule = await vi.importActual<typeof import("./url")>("./url");

  const extractCustomComponentPath = vi.fn();
  extractCustomComponentPath.mockReturnValue("/component/foo.bar/index.html");

  return { ...originalModule, extractCustomComponentPath };
});

describe("<CustomComponentIFrame />", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("mounts an iframe with a srcdoc loaded from the stlite kernel and calls manipulateIFrameDocument() after the iframe loaded", async () => {
    const src = ""; // `extractCustomComponentPath` is mocked, so src does not matter.
    const kernel = new StliteKernel({
      pyodideUrl: "",
      command: "run",
    });
    const { container } = render(
      <StliteKernelProvider kernel={kernel}>
        <CustomComponentIFrame src={src} />
      </StliteKernelProvider>
    );

    const getIFrame = () => container.getElementsByTagName("iframe")[0];

    await waitFor(() => expect(getIFrame().srcdoc).toBeTruthy());

    const iframe = getIFrame();
    expect(iframe.srcdoc).toEqual(mockIframeSrcDoc);
    expect(manipulateIFrameDocument).toBeCalledWith(
      kernel,
      expect.anything(),
      "/component/foo.bar"
    );
  });
});
