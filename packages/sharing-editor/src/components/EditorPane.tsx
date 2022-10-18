import React from "react";
import { Resizable } from "re-resizable";

interface EditorPaneProps {
  children: React.ReactNode;
}
function EditorPane(props: EditorPaneProps) {
  return (
    <Resizable
      defaultSize={{ width: "50%", height: "100%" }}
      enable={{ right: true }}
    >
      {props.children}
    </Resizable>
  );
}

export default EditorPane;
