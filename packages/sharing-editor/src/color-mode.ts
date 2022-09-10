// Detect the system color mode Ref: https://stackoverflow.com/a/57795495/13103190
export const isDarkMode = () =>
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
