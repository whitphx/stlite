import { getStreamlitVersion } from "./get_streamlit_version.js";

function getAbiTag() {
  // Retrieve ABI tag from environment variable or use a default value
  return process.env.ABI_TAG || "cp312-none-any";
}

export function getStreamlitWheelFileName() {
  const streamlitVersion = getStreamlitVersion();
  const abiTag = getAbiTag();
  return `streamlit-${streamlitVersion}-${abiTag}.whl`;
}
