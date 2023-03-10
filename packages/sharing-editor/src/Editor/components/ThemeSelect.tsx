import React from "react";

interface ThemeSelectProps {
  isDark: boolean;
  onChange: (isDark: boolean) => void;
}
function ThemeSelect(props: ThemeSelectProps) {
  return (
    <select
      value={props.isDark ? "dark" : "light"}
      onChange={(ev) => props.onChange(ev.target.value === "dark")}
    >
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
}

export default ThemeSelect;
