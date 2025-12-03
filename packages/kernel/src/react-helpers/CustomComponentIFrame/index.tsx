import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useStliteKernel } from "@stlite/kernel/contexts";
import { extractCustomComponentPath, getParentPath } from "./url";
import { manipulateIFrameDocument } from "./iframe-manipulation";

type AdditionalProps = { [key: string]: unknown };
type IFrameProps<T extends AdditionalProps = AdditionalProps> =
  JSX.IntrinsicElements["iframe"] & T;
interface CustomComponentIFrameProps extends IFrameProps {
  src: string;
  IframeComponent: React.ComponentType<IFrameProps>;
}

const InnerIFrame = React.forwardRef<
  HTMLIFrameElement,
  CustomComponentIFrameProps
>(({ src: path, IframeComponent, ...props }, ref) => {
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

        const type = headers.get("Content-Type");
        const blob = new Blob([body], type ? { type } : undefined);
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
    [kernel, path],
  );

  return (
    <IframeComponent
      {...props}
      srcDoc={srcdoc}
      onLoad={handleIFrameLoad}
      ref={ref}
    />
  );
});
InnerIFrame.displayName = "InnerIFrame";

const CustomComponentIFrame = React.forwardRef<
  HTMLIFrameElement,
  CustomComponentIFrameProps
>((props, ref) => {
  const kernel = useStliteKernel();
  const path = useMemo(
    () => extractCustomComponentPath(kernel.basePath, props.src),
    [kernel.basePath, props.src],
  );

  if (path == null) {
    return <iframe {...props} ref={ref} />;
  }
  return <InnerIFrame {...props} src={path} ref={ref} />;
});
CustomComponentIFrame.displayName = "StliteCustomComponentIFrame";

export default CustomComponentIFrame;
