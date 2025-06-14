import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __project_root = path.resolve(__dirname, "../../..")

function runPythonScript(scriptName) {
  try {
    const result = execSync(`uv run python ${scriptName}`, {
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

function getAbiTag(runtime) {
  if (runtime === "py") {
    return "py3-none-any"
  } else if (runtime === "cp") {
    const pyodidePythonVersion = execSync('uvx --from pyodide-cli --with pyodide-build pyodide config get python_version', {
      cwd: __project_root,
      encoding: "utf8"
    }).trim();

    const segments = pyodidePythonVersion.match(/^(?<major>3)\.(?<minor>\d+)\.(?<patch>\d+)$/)

    // https://github.com/pyodide/pyodide-build/blob/3d95b522fb416a24dc860e23ff88e77cece506d8/pyodide_build/_py_compile.py#L45
    const interpreter = "cp" + segments.groups["major"] + segments.groups["minor"]

    // https://github.com/pyodide/pyodide-build/blob/3d95b522fb416a24dc860e23ff88e77cece506d8/pyodide_build/_py_compile.py#L48
    const abiTag = interpreter + "-none-any";

    return abiTag;
  } else {
    throw new Error(`Unknown runtime: ${runtime}`);
  }
}

export function getStreamlitWheelFileName(runtime = "cp") {
  const streamlitVersion = getStreamlitVersion();
  const abiTag = getAbiTag(runtime);
  return `streamlit-${streamlitVersion}-${abiTag}.whl`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const subCommand = process.argv[2];
  switch (subCommand) {
    case "get-streamlit-wheel-file-name":
      const runtime = process.argv[3] ?? "cp";
      console.log(getStreamlitWheelFileName(runtime));
      break;
    default:
      console.error(`Unknown subcommand: ${subCommand}`);
  }
}
