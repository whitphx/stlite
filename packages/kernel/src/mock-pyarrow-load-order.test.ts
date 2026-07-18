import type { PyodideInterface } from "pyodide";
import { beforeAll, expect, suite, test } from "vitest";
import { initPyodide } from "./pyodide-loader";
import PYARROW_MOCK_SOURCE from "../py/stlite-lib/stlite_lib/_pyarrow_shim.py?raw";
import { getWheelUrls, pyodideUrl } from "./test-utils";

// worker-runtime.ts registers the pyarrow shim (with its source) as a micropip
// mock BEFORE installing packages, so a user requirement that transitively
// depends on pyarrow neither drags in the real (heavy, stlite-unsupported) wasm
// wheel nor needs a second post-install step. This guards that:
//   1. the real wheel is never fetched (download avoidance), and
//   2. `import pyarrow` resolves to the stlite stub right after install.
suite("pyarrow is mocked before install", { timeout: 300 * 1000 }, () => {
  let pyodide: PyodideInterface;

  beforeAll(async () => {
    pyodide = await initPyodide(pyodideUrl, {});
    await pyodide.loadPackage("micropip");
  });

  test("a pre-install mock keeps micropip from fetching the real pyarrow", async () => {
    const micropip = pyodide.pyimport("micropip");
    const wheels = getWheelUrls();

    // Mirror worker-runtime.ts: register the shim WITH its source BEFORE
    // installing anything.
    micropip.add_mock_package.callKwargs("pyarrow", "0.0.1", {
      modules: pyodide.toPy({ pyarrow: PYARROW_MOCK_SOURCE }),
    });

    // Now install with pyarrow in the closure (standing in for a user
    // requirement that pulls it). micropip must treat it as satisfied and
    // NOT download the real wheel.
    await micropip.install.callKwargs([wheels.stliteLib, "anyio", "pyarrow"], {
      keep_going: true,
    });

    // The real wheel (22.x) was never installed — only the 0.0.1 mock.
    const installedVersion = pyodide.runPython(
      `__import__("importlib.metadata", fromlist=["version"]).version("pyarrow")`,
    );
    expect(installedVersion).toBe("0.0.1");

    // `import pyarrow` resolves to the stub with no post-install step.
    const result = pyodide.runPython(`
import importlib, sys
importlib.invalidate_caches()
sys.modules.pop("pyarrow", None)
import pyarrow

raised = False
try:
    pyarrow.Table.from_pandas()
except NotImplementedError:
    raised = True

[pyarrow.__version__, raised]
`);
    const [stubVersion, raised] = result.toJs() as [string, boolean];
    result.destroy();
    expect(stubVersion).toBe("0.0.1");
    expect(raised).toBe(true);
  });
});
