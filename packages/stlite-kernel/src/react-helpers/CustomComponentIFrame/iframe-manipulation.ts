import { StliteKernel } from "../../kernel";

export function manipulateIFrameDocument(
  kernel: StliteKernel,
  document: Document,
  basePath: string
): Promise<void> {
  // TODO: Do the same for CSS tags
  const scriptTags = document.getElementsByTagName("script");
  const promises = [];
  for (const scriptTag of scriptTags) {
    if (scriptTag.src === "") {
      continue;
    }
    const url = new URL(scriptTag.src); // TODO: Check if src is relative or same origin
    const path = basePath + url.pathname;
    const promise = kernel
      .sendHttpRequest({
        method: "GET",
        headers: {},
        path,
        body: "",
      })
      .then(({ statusCode, headers, body }) => {
        if (statusCode !== 200) {
          return;
        }
        const blob = new Blob([body], { type: headers.get("Content-Type") });
        return blob.text().then((text) => {
          const newScriptTag = document.createElement("script");
          newScriptTag.text = text;
          newScriptTag.type = "text/javascript";
          scriptTag.replaceWith(newScriptTag); // TODO: The original <script /> is still executed, but it should be stopped before fetching the external file.
        });
      });
    promises.push(promise);
  }

  return Promise.all(promises).then();
}
