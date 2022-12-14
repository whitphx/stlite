import { describe, it, expect } from "vitest";
import { parseRequirementsTxt } from "./requirements-txt";

describe("parseRequirementsTxt", () => {
  it("returns package names written in the given string line by line, ignoring empty lines and white spaces and commented lines", () => {
    const content = `packageA

packageB
# comment
packageC`;
    expect(parseRequirementsTxt(content)).toEqual([
      "packageA",
      "packageB",
      "packageC",
    ]);
  });
});
