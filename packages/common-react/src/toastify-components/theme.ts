import { darkTheme, getDefaultTheme } from "@streamlit/lib";

export function isDarkTheme(): boolean {
  return getDefaultTheme().name === darkTheme.name;
}
