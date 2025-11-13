const a = ({
  enforceDownloadInNewTab: r,
  url: e,
  filename: s
}) => {
  const t = document.createElement("a");
  t.setAttribute("href", e), r ? t.setAttribute("target", "_blank") : t.setAttribute("target", "_self");
  const n = window.__streamlit?.DOWNLOAD_ASSETS_BASE_URL;
  return (!n || !e.startsWith(n) || window.navigator.userAgent.includes("Firefox")) && t.setAttribute("download", s), t;
};
export {
  a as c
};
//# sourceMappingURL=createDownloadLinkElement-CbRjLJ8e.js.map
