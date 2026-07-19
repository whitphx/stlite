import path from "node:path";
import { run } from "./spawn.ts";

/**
 * Run the Python vendoring helper (py/vendor_python_modules.py) inside the
 * output project's venv. `pywrangler sync` creates that venv before any caller
 * of this runs, and `uv run` resolves its interpreter cross-platform, so the
 * build needs no system python3. `--no-sync` keeps uv from re-resolving the
 * user's dependencies on every helper call.
 */
export function runVendorPythonModules(
  packageDir: string,
  projectDir: string,
  args: string[],
): Promise<void> {
  return run(
    "uv",
    [
      "run",
      "--no-sync",
      "--project",
      ".",
      "python",
      path.join(packageDir, "py", "vendor_python_modules.py"),
      ...args,
    ],
    { cwd: projectDir },
  );
}
