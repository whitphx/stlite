import { StliteKernel } from "../kernel";

export function parseContentDispositionHeader(value: string): string {
  // Extract a filename string from a ContentDisposition header value like `attachment; filename="StreamlitApp_2022-08-12_14-44-14.bin"`.

  const regexResult = /filename="([^"]*?)"/.exec(value);
  if (regexResult == null) {
    return "";
  }

  return regexResult[1];
}

export function downloadFileFromStlite(
  stliteKernel: StliteKernel,
  url: string
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
        contentDispositionHeader != null
          ? parseContentDispositionHeader(contentDispositionHeader)
          : "";

      const blob = new Blob([body], { type: headers.get("Content-Type") });
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
