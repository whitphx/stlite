import { darkTheme } from "@streamlit/lib/src/theme/themeConfigs";
import { getDefaultTheme } from "@streamlit/lib/src/theme/utils";

export function isDarkTheme(): boolean {
  return getDefaultTheme().name === darkTheme.name;
}
