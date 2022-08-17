import { afterEach, describe, it, expect, vi } from "vitest";
import { StliteKernel } from "../../kernel";
import { manipulateIFrameDocument } from "./iframe-manipulation";

const mockIframeSrcDoc = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Streamlit Custom Component</title>
  <link href="./static/css/main.870b2c18.chunk.css" rel="stylesheet">
  <script src="./346f82515df6a4f2eb7f15393fdcea08.js"></script>
</head>
<body>
  <div id="root"></div>
  <script>"This is an embedded script"</script>
  <script src="./static/js/2.55bd8404.chunk.js"></script>
</body>
</html>
`;

const mockHtmlResponses = {
  "/component/package.component/index.html": {
    contentType: "text/html",
    body: mockIframeSrcDoc,
  },
  "/component/package.component/346f82515df6a4f2eb7f15393fdcea08.js": {
    contentType: "text/javascript",
    body: `"This is foo.js"`,
  },
  "/component/package.component/static/js/2.55bd8404.chunk.js": {
    contentType: "text/javascript",
    body: `"This is bar.js"`,
  },
  "/component/package.component/static/css/main.870b2c18.chunk.css": {
    contentType: "text/css; charset=utf-8",
    body: `// This is a CSS file`,
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

  it("replaces the script tags with src attr in the document with the script tags with bodies loaded from the stlite kernel", async () => {
    const iframe = window.document.createElement("iframe");
    window.document.body.appendChild(iframe);
    iframe.contentWindow?.document.open();
    iframe.contentWindow?.document.write(mockIframeSrcDoc);
    iframe.contentWindow?.document.close();

    const iframeDocument = iframe.contentWindow?.document as Document;
    expect(iframeDocument).not.toBeUndefined();

    const kernel = new StliteKernel({
      pyodideUrl: "",
      command: "run",
    });

    await manipulateIFrameDocument(
      kernel,
      iframeDocument,
      "/component/package.component"
    );

    // Expect that the <script> tags with src attr have been replaced
    // with new <script> tags whose bodies were loaded from the stlite kernel.
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

    // Expect that the stylesheets specified via <link> tags
    // have been loaded and embedded as <style> tags.
    const styleTags = iframeDocument.getElementsByTagName("style");
    expect(styleTags.length).toBe(1);

    const styleTagHtmls: (string | null)[] = [];
    for (const styleTag of styleTags) {
      styleTagHtmls.push(styleTag.innerHTML);
    }
    expect(styleTagHtmls).toEqual(
      expect.arrayContaining([`// This is a CSS file`])
    );
  });
});
