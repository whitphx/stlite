import { StliteKernel } from "./kernel";
import StliteWorker from "./worker?worker";
import { beforeAll, expect, suite, test } from "vitest";
import { getWheelUrls, pyodideUrl } from "./test-utils";

suite(
  "StliteKernel.runPython",
  {
    timeout: 60 * 1000,
  },
  async () => {
    let kernel: StliteKernel;

    beforeAll(async () => {
      const worker = new StliteWorker();

      kernel = new StliteKernel({
        worker,
        pyodideUrl,
        wheelUrls: getWheelUrls(),
        entrypoint: "app.py",
        files: {
          "app.py": {
            data: `
import streamlit as st

st.write("Hello, stlite!")
st.write(123)
`,
          },
        },
        requirements: [],
        prebuiltPackageNames: [],
        archives: [],
      });
    });

    test("kernel.runPython() executes Python code and returns the result", async () => {
      const result = await kernel.runPython("1 + 2");
      expect(result).toBe(3);
    });

    test("kernel.runPython() can use installed packages", async () => {
      await kernel.install(["pytz==2025.2"]);
      const result = await kernel.runPython(`
import pytz
pytz.__version__
      `);
      expect(result).toBe("2025.2");
    });

    test("kernel.addMockPackage() can mock a package", async () => {
      await kernel.addMockPackage("foo", "1.2.3");
      const result = await kernel.runPython(`
import foo
foo.__name__
      `);
      expect(result).toBe("foo");
    });

    test("kernel.addMockPackage() can mock a package with options", async () => {
      await kernel.addMockPackage(
        "mock_pkg",
        "1.2.3",
        {
          mock_pkg: "version = '1.2.3'",
        },
        true,
      );
      const result = await kernel.runPython(`
import mock_pkg
mock_pkg.version
      `);
      expect(result).toBe("1.2.3");
    });
  },
);
