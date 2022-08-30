import React, { useEffect, useState, useCallback } from "react";
import { useStliteKernel } from "../StliteKernelProvider";
import { extractCustomComponentPath, getParentPath } from "./url";
import { manipulateIFrameDocument } from "./iframe-manipulation";

type IFrameProps = JSX.IntrinsicElements["iframe"];
interface CustomComponentIFrameProps extends IFrameProps {
  src: string;
}

const InnerIFrame = React.forwardRef<
  HTMLIFrameElement,
  CustomComponentIFrameProps
>(({ src: path, ...props }, ref) => {
  const kernel = useStliteKernel();

  const [srcdoc, setSrcdoc] = useState<string>();

  useEffect(() => {
    if (kernel == null) {
      return;
    }

    if (!path.startsWith("/component")) {
      return;
    }

    let released = false;
    kernel
      .sendHttpRequest({
        method: "GET",
        path: path,
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
  }, [kernel, path]);

  const handleIFrameLoad = useCallback<
    React.ReactEventHandler<HTMLIFrameElement>
  >(
    (ev) => {
      const iframe = ev.target as HTMLIFrameElement;
      const document = iframe.contentWindow?.document;
      if (document == null) {
        console.warn("document not found in iframe");
        return;
      }

      manipulateIFrameDocument(kernel, document, getParentPath(path));
    },
    [kernel, path]
  );

  return (
    <iframe {...props} srcDoc={srcdoc} onLoad={handleIFrameLoad} ref={ref} />
  );
});
InnerIFrame.displayName = "InnerIFrame";

const CustomComponentIFrame = React.forwardRef<
  HTMLIFrameElement,
  CustomComponentIFrameProps
>((props, ref) => {
  const kernel = useStliteKernel();
  const path = extractCustomComponentPath(kernel.basePath, props.src);

  if (path == null) {
    return <iframe {...props} ref={ref} />;
  }
  return <InnerIFrame {...props} src={path} ref={ref} />;
});
CustomComponentIFrame.displayName = "StliteCustomComponentIFrame";

export default CustomComponentIFrame;
