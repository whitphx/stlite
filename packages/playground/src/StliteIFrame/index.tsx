import React, { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { StliteKernel } from "@stlite/stlite-kernel";
import StliteApp from "./StliteApp";

// IFrame element to mount a React component, ref: https://stackoverflow.com/a/34744946/13103190

type IFrameProps = JSX.IntrinsicElements["iframe"];

interface StliteIFrameProps extends IFrameProps {
  kernel: StliteKernel;
}
const StliteIFrame = ({ kernel, ...props }: StliteIFrameProps) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);

  const mountNode = contentRef?.contentWindow?.document?.body;

  // The <style> tags that the CSS-in-JS libraries will generate should be inserted into the <head> tag in the iframe.
  const head = contentRef?.contentWindow?.document?.head;

  const onMount = useCallback<React.RefCallback<HTMLIFrameElement>>((node) => {
    setContentRef(node);
  }, []);

  return (
    <iframe {...props} ref={onMount}>
      {mountNode &&
        head &&
        createPortal(
          <StliteApp kernel={kernel} cssContainer={head} />,
          mountNode
        )}
    </iframe>
  );
};

export default StliteIFrame;
