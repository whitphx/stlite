import { LocalStore } from "streamlit-browser/src/lib/storageUtils";
import { darkTheme } from "streamlit-browser/src/theme/themeConfigs";

export function isDarkTheme() {
  // Ref: https://github.com/streamlit/streamlit/blob/1.12.0/frontend/src/theme/utils.ts#L544
  const cachedThemeStr = window.localStorage.getItem(LocalStore.ACTIVE_THEME);
  if (!cachedThemeStr) {
    return null;
  }
  const { name } = JSON.parse(cachedThemeStr);

  return name === darkTheme.name;
}
