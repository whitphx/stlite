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
  <script src="./static/js/foo.49ba281c.js"></script>
</head>
<body>
  <script>"This is an embedded script"</script>
  <script src="./static/js/bar.8a1fef02.js"></script>
</body>
</html>
`;

const mockHtmlResponses = {
  "/component/package.component/index.html": {
    contentType: "text/html",
    body: mockIframeSrcDoc,
  },
  "/component/package.component/static/js/foo.49ba281c.js": {
    contentType: "text/javascript",
    body: `"This is foo.js"`,
  },
  "/component/package.component/static/js/bar.8a1fef02.js": {
    contentType: "text/javascript",
    body: `"This is bar.js"`,
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

describe("CustomComponentIFrame", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("sets iframe with a srcdoc loaded from the stlite kernel and calls manipulateIFrameDocument() after the iframe loaded", async () => {
    const src =
      "http://xxx:99999/component/package.component/index.html?streamlitUrl=http%3A%2F%2Flocalhost%3A3000%2F";
    const kernel = new StliteKernel({
      pyodideUrl: "",
      command: "run",
    });
    const { container } = render(
      <StliteKernelProvider kernel={kernel}>
        <CustomComponentIFrame src={src} />{" "}
      </StliteKernelProvider>
    );

    const getIFrame = () => container.getElementsByTagName("iframe")[0];

    await waitFor(() => expect(getIFrame().srcdoc).toBeTruthy());

    const iframe = getIFrame();
    expect(iframe.srcdoc).toEqual(mockIframeSrcDoc);
    expect(manipulateIFrameDocument).toBeCalledWith(
      kernel,
      expect.anything(),
      "/component/package.component"
    );
  });
});
