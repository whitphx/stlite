import React, { useRef, useState, useCallback } from "react";
import { Resizable, ResizableProps } from "re-resizable";

const RESIZABLE_ENABLE_PROP = { bottom: true };
const MIN_RESIZABLE_HEIGHT = 24;
const FOOTER_HEIGHT = 40;

interface ResizableHeaderProps {
  resizableArea: React.ReactNode;
  fixedFooter?: React.ReactNode;
}
function ResizableHeader(props: ResizableHeaderProps) {
  const [maxHeight, setMaxHeight] = useState<number>();
  const innerElemRef = useRef<HTMLDivElement>(null);
  const onResizeStart = useCallback<
    NonNullable<ResizableProps["onResizeStart"]>
  >(() => {
    const innerElem = innerElemRef.current;
    if (innerElem == null) {
      return;
    }

    setMaxHeight(innerElem.clientHeight);
  }, []);

  return (
    <Resizable
      minHeight={MIN_RESIZABLE_HEIGHT + (props.fixedFooter ? FOOTER_HEIGHT : 0)}
      maxHeight={maxHeight}
      enable={RESIZABLE_ENABLE_PROP}
      onResizeStart={onResizeStart}
      style={{
        display: "flex",
      }}
    >
      <div
        style={{
          overflow: "scroll",
        }}
      >
        <div
          ref={innerElemRef}
          style={{
            paddingBottom: props.fixedFooter ? FOOTER_HEIGHT : 0,
          }}
        >
          {props.resizableArea}
        </div>
      </div>
      {props.fixedFooter && (
        <div
          style={{
            height: FOOTER_HEIGHT,
            position: "absolute",
            width: "100%",
            left: 0,
            bottom: 0,
            background: "#fff",
          }}
        >
          {props.fixedFooter}
        </div>
      )}
    </Resizable>
  );
}

export default ResizableHeader;
