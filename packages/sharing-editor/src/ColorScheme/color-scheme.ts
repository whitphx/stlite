import { useState, useEffect } from "react";
import {
  type ColorScheme,
  CLASS_NAME_DARK_MODE,
  CLASS_NAME_LIGHT_MODE,
} from "./ColorSchemeSelector";

function getAppColorSchemePreference(): ColorScheme {
  if (document.body.classList.contains(CLASS_NAME_LIGHT_MODE)) {
    return "light";
  }
  if (document.body.classList.contains(CLASS_NAME_DARK_MODE)) {
    return "dark";
  }
  return "auto";
}

export const useDarkMode = (): boolean => {
  const [systemDarkMode, setSystemDarkMode] = useState<boolean>(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const [appColorScheme, setAppColorScheme] = useState<ColorScheme>(
    getAppColorSchemePreference(),
  );

  useEffect(() => {
    // Listen to the system color mode change
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );
    const darkModeChangeListener = () =>
      setSystemDarkMode(darkModeMediaQuery.matches);
    darkModeMediaQuery.addEventListener("change", darkModeChangeListener);
    darkModeChangeListener();

    // Listen to the app color mode change
    const bodyClassListChangeListener = () => {
      setAppColorScheme(getAppColorSchemePreference());
    };
    const bodyClassListObserver = new MutationObserver(
      bodyClassListChangeListener,
    );
    bodyClassListObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    bodyClassListChangeListener();

    return () => {
      darkModeMediaQuery.removeEventListener("change", darkModeChangeListener);
      bodyClassListObserver.disconnect();
    };
  }, []);

  if (appColorScheme === "dark") {
    return true;
  }
  if (appColorScheme === "light") {
    return false;
  }
  return systemDarkMode ?? false;
};
