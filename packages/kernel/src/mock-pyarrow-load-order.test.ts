import type { PyodideInterface } from "pyodide";
import { beforeAll, expect, suite, test } from "vitest";
import { initPyodide } from "./pyodide-loader";
import { getWheelUrls, pyodideUrl } from "./test-utils";

// worker-runtime.ts registers pyarrow as a micropip mock BEFORE installing
// packages, so a user requirement that transitively depends on pyarrow does not
// drag in the real (heavy, stlite-unsupported) wasm wheel. This guards that:
//   1. the real wheel is never fetched (download avoidance), and
//   2. `import pyarrow` still resolves to the stlite stub after
//      runtimeInit.mock_pyarrow() installs the in-process shim.
suite("pyarrow is mocked before install", { timeout: 300 * 1000 }, () => {
  let pyodide: PyodideInterface;

  beforeAll(async () => {
    pyodide = await initPyodide(pyodideUrl, {});
    await pyodide.loadPackage("micropip");
  });

  test("a pre-install mock keeps micropip from fetching the real pyarrow", async () => {
    const micropip = pyodide.pyimport("micropip");
    const wheels = getWheelUrls();

    // Mirror worker-runtime.ts: register the mock BEFORE installing anything.
    micropip.add_mock_package("pyarrow", "0.0.1");

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

    // And the import shim is in place after mock_pyarrow().
    const runtimeInit = pyodide.pyimport("stlite_lib.runtime_init");
    runtimeInit.mock_pyarrow();
    runtimeInit.invalidate_import_caches();

    const result = pyodide.runPython(`
import sys
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
