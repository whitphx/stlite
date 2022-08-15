import React, { useEffect, useState, useCallback } from "react";
import { useStliteKernel } from "./StliteKernelProvider";
import { extractCustomComponentPath } from "./custom-component";
import { StliteKernel } from "../kernel";

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

type IFrameProps = JSX.IntrinsicElements["iframe"];
interface CustomComponentIFrameProps extends IFrameProps {
  src: string;
}

const InnerIframe = React.forwardRef<
  HTMLIFrameElement,
  CustomComponentIFrameProps
>(({ src, ...props }, ref) => {
  const kernel = useStliteKernel();
  const rawUrl = src;

  const [srcdoc, setSrcdoc] = useState<string>();

  useEffect(() => {
    if (kernel == null) {
      return;
    }

    if (!rawUrl.startsWith("/component")) {
      return;
    }

    let released = false;
    kernel
      .sendHttpRequest({
        method: "GET",
        path: rawUrl,
        headers: {},
        body: "",
      })
      .then(({ statusCode, headers, body }) => {
        if (released) {
          return;
        }
        if (statusCode !== 200) {
          return;
        }

        const blob = new Blob([body], { type: headers.get("Content-Type") });
        blob.text().then((text) => {
          if (released) {
            return;
          }

          setSrcdoc(text);
        });
      });

    return () => {
      released = true;
    };
  });

  const handleIFrameLoaded = useCallback<
    React.ReactEventHandler<HTMLIFrameElement>
  >(
    (ev) => {
      const iframe = ev.target as HTMLIFrameElement;
      const document = iframe.contentWindow?.document;
      if (document == null) {
        console.warn("document not found in iframe");
        return;
      }

      manipulateIFrameDocument(
        kernel,
        document,
        rawUrl.split("/").slice(0, -1).join("/")
      );
    },
    [kernel, rawUrl]
  );

  return (
    <iframe {...props} srcDoc={srcdoc} onLoad={handleIFrameLoaded} ref={ref} />
  );
});
InnerIframe.displayName = "InnerIframe";

const CustomComponentIFrame = React.forwardRef<
  HTMLIFrameElement,
  CustomComponentIFrameProps
>((props, ref) => {
  const path = extractCustomComponentPath(props.src);

  if (path == null) {
    return <iframe {...props} ref={ref} />;
  }
  return <InnerIframe {...props} src={path} ref={ref} />;
});
CustomComponentIFrame.displayName = "StliteCustomComponentIFrame";

export default CustomComponentIFrame;
