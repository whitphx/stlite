import { URLExt } from "@jupyterlab/coreutils";
import { StliteKernel } from "../../kernel";
import { getRelativePath } from "./url";

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

    const relPath = getRelativePath(
      window.location.host,
      window.location.pathname,
      new URL(scriptTag.src)
    );
    if (relPath == null) {
      continue;
    }

    const path = URLExt.join(basePath, relPath);

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
