import { getStreamlitVersion } from "./get_streamlit_version.js";

export function getStreamlitWheelFileName() {
  const streamlitVersion = getStreamlitVersion();
  return `streamlit-${streamlitVersion}-cp312-none-any.whl`;
}
