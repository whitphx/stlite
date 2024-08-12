import { useCallback } from "react";
import { AppData, embedAppDataToUrl } from "@stlite/sharing-common";
import { FaExternalLinkAlt } from "react-icons/fa";
import ToolbarButton from "./ToolbarButton";

interface AppOpenButtonProps {
  appData: AppData;
  sharingAppSrc: string;
}
function AppOpenButton(props: AppOpenButtonProps) {
  const handleClick = useCallback(() => {
    const url = embedAppDataToUrl(props.sharingAppSrc, props.appData);
    window.open(url, "_blank", "noopener,noreferrer");
  }, [props.appData, props.sharingAppSrc]);
  return (
    <ToolbarButton onClick={handleClick} icon={<FaExternalLinkAlt />}>
      Open App
    </ToolbarButton>
  );
}

export default AppOpenButton;
