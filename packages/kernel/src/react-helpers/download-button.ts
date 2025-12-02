import { useCallback } from "react";
import type { StliteKernel } from "../kernel";
import { useStliteKernel } from "@stlite/kernel/contexts";
import { parse } from "@tinyhttp/content-disposition";

export function getFileNameFromContentDispositionHeader(
  contentDisposition: string,
): string | undefined {
  const parsed = parse(contentDisposition);
  if (parsed.type !== "attachment") {
    return;
  }

  const filename = parsed.parameters.filename;
  if (typeof filename !== "string") {
    return;
  }

  return filename;
}

export function downloadFileFromStlite(
  stliteKernel: StliteKernel,
  url: string,
) {
  stliteKernel
    .sendHttpRequest({
      method: "GET",
      path: `${url}?title=${encodeURIComponent(document.title)}`, // Ref: https://github.com/streamlit/streamlit/blob/41a1a60b6bd72b13effec1bbcc6551afa0878d23/frontend/src/components/widgets/DownloadButton/DownloadButton.tsx#L49
      headers: {},
      body: "",
    })
    .then(({ statusCode, headers, body }) => {
      if (statusCode !== 200) {
        return;
      }

      const contentDispositionHeader = headers.get("Content-Disposition");
      const downloadFilename =
        (contentDispositionHeader &&
          getFileNameFromContentDispositionHeader(contentDispositionHeader)) ??
        "";

      const type = headers.get("Content-Type");
      const blob = new Blob([body], type ? { type } : undefined);
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", objectUrl);
      link.setAttribute("target", "_blank");
      link.setAttribute("download", downloadFilename);
      link.click();

      URL.revokeObjectURL(objectUrl);
      link.remove();
    });
}

export function useDownloadFileFromStlite() {
  const stliteKernel = useStliteKernel();

  return useCallback(
    (url: string) => {
      downloadFileFromStlite(stliteKernel, url);
    },
    [stliteKernel],
  );
}
