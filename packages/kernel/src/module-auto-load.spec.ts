// @vitest-environment node

import { loadPyodide, PyodideInterface } from "pyodide";
import { describe, it, expect, beforeEach } from "vitest";
import { findImports, unionSets } from "./module-auto-load";

describe("findImports()", () => {
  let pyodide: PyodideInterface;

  beforeEach(async () => {
    pyodide = await loadPyodide({
      indexURL: "../../node_modules/pyodide", // Installed at the Yarn workspace root
    });
  });

  it("finds imports", () => {
    const pyCode = `
import os
import sys
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
from typing import List
from package import module as aliased_module
`;

    const imports = findImports(pyodide, pyCode);
    expect(imports).toEqual(
      new Set([
        "os",
        "sys",
        "numpy",
        "matplotlib",
        "pathlib",
        "typing",
        "package",
      ])
    );
  });

  it("finds only module-level imports", () => {
    const pyCode = `
import pandas as pd

def foo():
    import numpy as np
`;

    const imports = findImports(pyodide, pyCode);
    expect(imports).toEqual(new Set(["pandas"]));
  });
});

describe("unionSets", () => {
  it("unions sets", () => {
    const set1 = new Set([1, 2, 3]);
    const set2 = new Set([3, 4, 5]);
    const set3 = new Set([5, 6, 7]);

    const result = unionSets([set1, set2, set3]);
    expect(result).toEqual(new Set([1, 2, 3, 4, 5, 6, 7]));
  });
});
