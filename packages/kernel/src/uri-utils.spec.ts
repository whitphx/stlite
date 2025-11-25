import { describe, it, expect } from "vitest";
import { normalizeBasePath } from "./uri-utils";

describe("normalizeBasePath", () => {
  it("removes trailing slashes", () => {
    expect(normalizeBasePath("path/to/app/")).toEqual("path/to/app");
    expect(normalizeBasePath("path/to/app///")).toEqual("path/to/app");
  });

  it("removes leading slashes", () => {
    expect(normalizeBasePath("/path/to/app")).toEqual("path/to/app");
    expect(normalizeBasePath("///path/to/app")).toEqual("path/to/app");
  });

  it("removes both leading and trailing slashes", () => {
    expect(normalizeBasePath("/path/to/app/")).toEqual("path/to/app");
    expect(normalizeBasePath("///path/to/app///")).toEqual("path/to/app");
  });

  it("returns empty string for root path", () => {
    expect(normalizeBasePath("/")).toEqual("");
    expect(normalizeBasePath("///")).toEqual("");
  });

  it("returns the same string if there are no leading or trailing slashes", () => {
    expect(normalizeBasePath("path/to/app")).toEqual("path/to/app");
  });
});
