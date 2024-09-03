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

export function useAppColorSchemePreference(): ColorScheme {
  const [appColorScheme, setAppColorScheme] = useState<ColorScheme>(
    getAppColorSchemePreference()
  );

  useEffect(() => {
    const bodyClassListChangeListener = () => {
      setAppColorScheme(getAppColorSchemePreference());
    };
    const bodyClassListObserver = new MutationObserver(
      bodyClassListChangeListener
    );
    bodyClassListObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    bodyClassListChangeListener();

    return () => {
      bodyClassListObserver.disconnect();
    };
  }, []);

  return appColorScheme;
}

export function useSystemColorSchemePreference(): "dark" | "light" {
  const [systemDarkMode, setSystemDarkMode] = useState<boolean>(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const darkModeChangeListener = () =>
      setSystemDarkMode(darkModeMediaQuery.matches);
    darkModeMediaQuery.addEventListener("change", darkModeChangeListener);
    darkModeChangeListener();

    return () => {
      darkModeMediaQuery.removeEventListener("change", darkModeChangeListener);
    };
  }, []);

  return systemDarkMode ? "dark" : "light";
}

export const useDarkMode = (): boolean => {
  const appColorScheme = useAppColorSchemePreference();
  const systemColorScheme = useSystemColorSchemePreference();

  if (appColorScheme === "dark") {
    return true;
  }
  if (appColorScheme === "light") {
    return false;
  }
  return systemColorScheme === "dark";
};
