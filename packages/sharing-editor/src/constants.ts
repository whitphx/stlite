/**
 * Returns the URL for the stlite sharing app
 * that is loaded inside the iframe
 */
export const getStliteSharingURL = async () => {
  const sharingAppSrc =
    SHARING_APP_URL ??
    (RESOLVE_SHARING_APP_URL_RUNTIME_FROM_EXTERNAL_FILE
      ? // For preview builds on CI whose SHARING_APP_URL can't be determined at build time,
        // the sharing app URL is resolved at runtime from the /SHARING_APP_URL file.
        await fetch("/SHARING_APP_URL").then((res) => res.text())
      : undefined);
  if (sharingAppSrc == null) {
    throw new Error("The URL of the sharing app is not set");
  }
  const sharingAppUrl = new URL(sharingAppSrc);
  return sharingAppUrl;
};

export const STLITE_SHARING_IFRAME_ID = "stliteSharingIframe";
