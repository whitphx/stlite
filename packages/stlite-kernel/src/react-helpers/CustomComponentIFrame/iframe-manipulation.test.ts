import { afterEach, describe, it, expect, vi } from "vitest";
import { StliteKernel } from "../../kernel";
import { manipulateIFrameDocument } from "./iframe-manipulation";

// TODO: Share the mock implementation with index.test.ts
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

describe("manipulateIFrameDocument", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("replaces the script tags in the document whose sources are external with scripts loaded from the stlite kernel", async () => {
    const iframe = window.document.createElement("iframe");
    window.document.body.appendChild(iframe);
    iframe.contentWindow?.document.open();
    iframe.contentWindow?.document.write(mockIframeSrcDoc);
    iframe.contentWindow?.document.close();

    const kernel = new StliteKernel({
      pyodideUrl: "",
      command: "run",
    });

    const iframeDocument = iframe.contentWindow?.document as Document;
    expect(iframeDocument).not.toBeUndefined();

    await manipulateIFrameDocument(
      kernel,
      iframeDocument,
      "/component/package.component"
    );

    const scriptTags = iframeDocument.getElementsByTagName("script");
    expect(scriptTags.length).toBe(3);

    const scriptTexts: string[] = [];
    for (const scriptTag of scriptTags) {
      scriptTexts.push(scriptTag.text);
    }
    expect(scriptTexts).toEqual(
      expect.arrayContaining([
        `"This is an embedded script"`, // The script tags without src attr are not replaced
        `"This is foo.js"`,
        `"This is bar.js"`,
      ])
    );
  });
});
