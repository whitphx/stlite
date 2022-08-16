import React, { useEffect, useState, useCallback } from "react";
import { useStliteKernel } from "../StliteKernelProvider";
import { extractCustomComponentPath } from "./path";
import { manipulateIFrameDocument } from "./iframe-manipulation";

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
  const path = extractCustomComponentPath(
    window.location.pathname, // TODO: Copied from the implementation of `ConnectionManager.getBaseUriParts`. This value should be got by calling the method.
    props.src
  );

  if (path == null) {
    return <iframe {...props} ref={ref} />;
  }
  return <InnerIframe {...props} src={path} ref={ref} />;
});
CustomComponentIFrame.displayName = "StliteCustomComponentIFrame";

export default CustomComponentIFrame;
