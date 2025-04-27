import fs from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { PrebuiltPackagesDataReader } from "./pyodide_packages.js";

describe("PrebuiltPackagesDataReader", () => {
  it("should be able to read the package info from the remote URL", async () => {
    const reader = new PrebuiltPackagesDataReader(
      "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/",
    );
    const packageInfo = await reader.getPackageInfoByName("numpy");
    expect(packageInfo).toEqual(
      expect.objectContaining({
        name: "numpy",
        version: "2.0.2",
        file_name: "numpy-2.0.2-cp312-cp312-pyodide_2024_0_wasm32.whl",
        imports: ["numpy"],
        install_dir: "site",
        package_type: "package",
        unvendored_tests: true,
      }),
    );
  });

  it("should be able to read the package info from the local file", async () => {
    const testDir = fs.mkdtempSync(path.join(tmpdir(), "stlite-test"));
    console.log("testDir", testDir);

    await fetch(
      "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide-lock.json",
    )
      .then((res) => res.text())
      .then((data) => {
        fs.writeFileSync(path.join(testDir, "pyodide-lock.json"), data);
      });

    const reader = new PrebuiltPackagesDataReader(testDir);
    const packageInfo = await reader.getPackageInfoByName("numpy");
    expect(packageInfo).toEqual(
      expect.objectContaining({
        name: "numpy",
        version: "2.0.2",
        file_name: "numpy-2.0.2-cp312-cp312-pyodide_2024_0_wasm32.whl",
        imports: ["numpy"],
        install_dir: "site",
        package_type: "package",
        unvendored_tests: true,
      }),
    );
  });
});
