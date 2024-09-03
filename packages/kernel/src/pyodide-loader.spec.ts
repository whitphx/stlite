import { describe, it, expect } from "vitest";
import { resolvePyodideUrl } from "./pyodide-loader";

describe("resolvePyodideUrl", () => {
  it("resolves a non-ESM remote URL", async () => {
    const result = await resolvePyodideUrl(
      "https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.js"
    );
    expect(result).toEqual({
      scriptURL: "https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.js",
      pyodideIndexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.0/full/",
      isESModule: false,
    });
  });

  it("resolves an ESM remote URL", async () => {
    const result = await resolvePyodideUrl(
      "https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.mjs"
    );
    expect(result).toEqual({
      scriptURL: "https://cdn.jsdelivr.net/pyodide/v0.26.0/full/pyodide.mjs",
      pyodideIndexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.0/full/",
      isESModule: true,
    });
  });

  it("resolves a non-ESM local URL", async () => {
    const result = await resolvePyodideUrl("/path/to/pyodide.js");
    expect(result).toEqual({
      scriptURL: "/path/to/pyodide.js",
      pyodideIndexURL: "/path/to/",
      isESModule: false,
    });
  });

  it("resolves an ESM local URL", async () => {
    const result = await resolvePyodideUrl("/path/to/pyodide.mjs");
    expect(result).toEqual({
      scriptURL: "file:///path/to/pyodide.mjs", // import() requires the `file://` scheme on Windows
      pyodideIndexURL: "/path/to/",
      isESModule: true,
    });
  });
});
