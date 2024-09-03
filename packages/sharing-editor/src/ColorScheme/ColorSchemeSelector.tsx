import React, { useEffect, useCallback } from "react";
import { FaSun, FaMoon, FaAdjust } from "react-icons/fa";
import { useLocalStorage } from "usehooks-ts";
import styles from "./ColorSchemeSelector.module.scss";

export type ColorScheme = "light" | "dark" | "auto";

// NOTE: These class names are used in the CSS file to apply the color scheme,
// so they must be kept in sync with the CSS file.
// See global.scss.
export const CLASS_NAME_LIGHT_MODE = "theme-light";
export const CLASS_NAME_DARK_MODE = "theme-dark";

function ColorSchemeSelector() {
  const [value, setValue] = useLocalStorage<ColorScheme>(
    "color-scheme",
    "auto"
  );
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value as ColorScheme);
    },
    [setValue]
  );

  useEffect(() => {
    document.body.classList.remove(CLASS_NAME_LIGHT_MODE, CLASS_NAME_DARK_MODE);
    if (value === "light") {
      document.body.classList.add(CLASS_NAME_LIGHT_MODE);
    } else if (value === "dark") {
      document.body.classList.add(CLASS_NAME_DARK_MODE);
    }
  }, [value]);

  return (
    <div className={styles.colorSchemeSelector}>
      <label
        className={styles.icon}
        aria-selected={value === "auto"}
        title="Auto"
      >
        <input
          type="radio"
          name="color-scheme"
          value="auto"
          checked={value === "auto"}
          onChange={handleChange}
        />
        <FaAdjust />
      </label>
      <label
        className={styles.icon}
        aria-selected={value === "light"}
        title="Light"
      >
        <input
          type="radio"
          name="color-scheme"
          value="light"
          checked={value === "light"}
          onChange={handleChange}
        />
        <FaSun />
      </label>
      <label
        className={styles.icon}
        aria-selected={value === "dark"}
        title="Dark"
      >
        <input
          type="radio"
          name="color-scheme"
          value="dark"
          checked={value === "dark"}
          onChange={handleChange}
        />
        <FaMoon />
      </label>
    </div>
  );
}

export default ColorSchemeSelector;
