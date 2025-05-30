import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function runPythonScript(scriptName) {
  try {
    const result = execSync(`python ${scriptName}`, {
      cwd: __dirname,
      encoding: "utf8",
    }).trim();
    return result;
  } catch (error) {
    throw new Error(`Failed to run Python script ${scriptName}: ${error.message}`);
  }
}

function getStreamlitVersion() {
  return runPythonScript("get_streamlit_version.py");
}

function getAbiTag() {
  return runPythonScript("get_abi_tag.py");
}

export function getStreamlitWheelFileName() {
  const streamlitVersion = getStreamlitVersion();
  const abiTag = getAbiTag();
  return `streamlit-${streamlitVersion}-${abiTag}.whl`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(getStreamlitWheelFileName());
}
