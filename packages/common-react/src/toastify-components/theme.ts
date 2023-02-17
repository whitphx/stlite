import {
  LocalStore,
  localStorageAvailable,
} from "streamlit-browser/src/lib/storageUtils";
import { darkTheme } from "streamlit-browser/src/theme/themeConfigs";

function isSystemDarkTheme(): boolean {
  // Detect the system color mode. Ref: https://stackoverflow.com/a/57795495/13103190
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function isDarkTheme(): boolean {
  if (!localStorageAvailable()) {
    return isSystemDarkTheme();
  }

  // Ref: https://github.com/streamlit/streamlit/blob/1.12.0/frontend/src/theme/utils.ts#L544
  const cachedThemeStr = window.localStorage.getItem(LocalStore.ACTIVE_THEME);
  if (!cachedThemeStr) {
    return isSystemDarkTheme();
  }

  const { name } = JSON.parse(cachedThemeStr);

  return name === darkTheme.name;
}
