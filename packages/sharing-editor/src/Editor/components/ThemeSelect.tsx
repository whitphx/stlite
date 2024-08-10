import React from "react";
import styles from "./ThemeSelect.module.scss";

interface ThemeSelectProps {
  isDark: boolean;
  onChange: (isDark: boolean) => void;
}
function ThemeSelect(props: ThemeSelectProps) {
  return (
    <select
      value={props.isDark ? "dark" : "light"}
      onChange={(ev) => props.onChange(ev.target.value === "dark")}
      className={styles.themeSelect}
    >
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
}

export default ThemeSelect;
