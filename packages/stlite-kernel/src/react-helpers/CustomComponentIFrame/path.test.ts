import { describe, it, expect } from "vitest";
import { extractCustomComponentPath } from "./path";

describe("extractCustomComponentPath", () => {
  it("extracts URL path from full URL", () => {
    const input =
      "http://xxx:99999/component/package.component/index.html?streamlitUrl=http%3A%2F%2Flocalhost%3A3000%2F";
    expect(extractCustomComponentPath(input)).toEqual(
      "/component/package.component/index.html"
    );
  });
});
