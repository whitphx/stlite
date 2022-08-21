// @vitest-environment node

import { loadPyodide, PyodideInterface } from "pyodide";
import { describe, it, expect, beforeEach } from "vitest";
import { writeFileWithParents } from "./file";

describe("makeFileWithParents()", () => {
  let pyodide: PyodideInterface;

  beforeEach(async () => {
    pyodide = await loadPyodide({
      indexURL: "../../node_modules/pyodide", // Installed at the Yarn workspace root
    });
  });

  const testCases: { paths: string[] }[] = [
    { paths: ["foo.py"] },
    { paths: ["foo/bar.py"] },
    { paths: ["foo/bar.py", "foo/hoge.py"] },
    { paths: ["foo/bar/baz.py"] },
    { paths: ["foo/bar/baz.py", "foo/bar/hoge.py"] },
    { paths: ["/foo.py"] },
  ];
  testCases.forEach(({ paths }) => {
    it(`writes files (${paths})`, () => {
      for (const path of paths) {
        expect(pyodide.FS.analyzePath(path).exists).toBe(false);

        writeFileWithParents(pyodide, path, "# Test");

        expect(pyodide.FS.analyzePath(path).exists).toBe(true);
        expect(pyodide.FS.readFile(path, { encoding: "utf8" })).toEqual(
          "# Test"
        );
      }
    });
  });

  it("can write binary files", () => {
    const path = "foo/bar.dat";
    const uint8View = new Uint8Array([0, 1, 2, 3]); // Random data
    writeFileWithParents(pyodide, path, uint8View);
    expect(pyodide.FS.readFile(path)).toEqual(uint8View);
  });
});
