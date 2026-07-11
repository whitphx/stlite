import React from "react";

export { ConnectionManager } from "@streamlit/connection";

export function useStliteResolvedLogo<
  T extends { image: string; iconImage: string },
>(logo: T | null): T | null {
  return logo;
}

export function useStliteMediaObjectUrl(rawUrl: string): string {
  return rawUrl;
}

export function useStliteMediaObjects<T extends { url?: string | null }>(
  inputMediaObjects: T[],
): T[] {
  return inputMediaObjects;
}

export function useDownloadFileFromStlite(): (url: string) => true {
  return (url: string) => {
    const anchor = document.createElement("a");
    anchor.href = new URL(url, window.location.href).toString();
    anchor.download = "";
    anchor.style.display = "none";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    return true;
  };
}

type AdditionalProps = { [key: string]: unknown };
type IFrameProps<T extends AdditionalProps = AdditionalProps> =
  JSX.IntrinsicElements["iframe"] & T;

interface CustomComponentIFrameProps extends IFrameProps {
  IframeComponent: React.ComponentType<IFrameProps>;
}

export const CustomComponentIFrame = React.forwardRef<
  HTMLIFrameElement,
  CustomComponentIFrameProps
>(({ IframeComponent, ...props }, ref) => (
  <IframeComponent {...props} ref={ref} />
));

CustomComponentIFrame.displayName = "RemoteCustomComponentIFrame";
