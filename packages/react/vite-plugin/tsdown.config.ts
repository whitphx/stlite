import { defineConfig } from "tsdown";
import { getStreamlitWheelFileName } from "@stlite/devutils";

const STREAMLIT_WHEEL_FILE_NAME = getStreamlitWheelFileName();

export default defineConfig({
  tsconfig: "../tsconfig.json",
  dts: true,
  define: {
    STREAMLIT_WHEEL_FILE_NAME: JSON.stringify(STREAMLIT_WHEEL_FILE_NAME),
  },
});
