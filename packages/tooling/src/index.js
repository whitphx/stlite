import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __project_root = path.resolve(__dirname, "../../..");

function getStreamlitVersion() {
  const result = execSync(`uv run python get_streamlit_version.py`, {
    cwd: __dirname,
    encoding: "utf8",
  }).trim();
  return result;
}

function getAbiTag(runtime) {
  if (runtime === "py") {
    return "py3-none-any";
  } else if (runtime === "cp") {
    // `pyodide config get` runs `make -f Makefile.envs` with our environment:
    // https://github.com/pyodide/pyodide-build/blob/cd83fadd67dd3e9586d1dff6aafae282911f8bc3/pyodide_build/config.py#L146-L156
    // The root Makefile reaches here from a `$(shell ...)`,
    // and GNU Make 4.4 and later export MAKEFLAGS to it:
    // https://github.com/mirror/make/blob/4.4/NEWS#L74-L79
    // Under `make -q` or `make -n`, that `make` would then run in the same mode
    // and print none of the values `pyodide config get` reads.
    // Drop this once a pyodide-build release ships the fix proposed in
    // https://github.com/pyodide/pyodide-build/pull/447
    const { MAKEFLAGS, ...env } = process.env;
    const pyodidePythonVersion = execSync(
      // Looks like `uvx` doesn't respect the `.python-version` file, so we need to pass the version manually. Ref: https://github.com/astral-sh/uv/issues/8206#issuecomment-2793478986
      "uvx -p $(cat .python-version) --from pyodide-cli --with pyodide-build pyodide config get python_version",
      {
        cwd: __project_root,
        encoding: "utf8",
        env,
      },
    ).trim();

    const segments = pyodidePythonVersion.match(
      /^(?<major>3)\.(?<minor>\d+)\.(?<patch>\d+)$/,
    );

    // https://github.com/pyodide/pyodide-build/blob/3d95b522fb416a24dc860e23ff88e77cece506d8/pyodide_build/_py_compile.py#L45
    const interpreter =
      "cp" + segments.groups["major"] + segments.groups["minor"];

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
