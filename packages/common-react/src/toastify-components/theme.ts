import { darkTheme } from "@streamlit/lib/src/theme/themeConfigs";
import {
  getDefaultTheme,
  AUTO_THEME_NAME,
} from "@streamlit/lib/src/theme/utils";

export function isDarkTheme(): boolean {
  const themeName = getDefaultTheme().name;
  if (themeName === AUTO_THEME_NAME) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return themeName === darkTheme.name;
}
