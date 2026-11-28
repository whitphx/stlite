import { describe, it, expect } from "vitest";
import { isStreamlitConfig } from "./types";

describe("isStreamlitConfig", () => {
  it("accepts primitive option values", () => {
    expect(
      isStreamlitConfig({
        "client.toolbarMode": "viewer",
        "theme.baseFontSize": 14,
        "client.showSidebarNavigation": false,
        "theme.font": null,
        "theme.codeFont": undefined,
      }),
    ).toBe(true);
  });

  // https://github.com/whitphx/stlite/issues/1932
  it("accepts an array of objects for options like theme.fontFaces", () => {
    expect(
      isStreamlitConfig({
        "theme.fontFaces": [
          {
            family: "Inter",
            url: "app/static/Inter.ttf",
            style: "normal",
            weight: 500,
          },
        ],
        "theme.chartCategoricalColors": ["#000000", "#ffffff"],
      }),
    ).toBe(true);
  });

  [
    { name: "null", value: null },
    { name: "an array", value: ["theme.font"] },
    { name: "a string", value: "theme.font" },
    { name: "a function value", value: { "theme.font": () => "Inter" } },
    {
      name: "a non-plain object value",
      value: { "theme.fontFaces": [{ url: new URL("https://example.com") }] },
    },
  ].forEach(({ name, value }) => {
    it(`rejects ${name}`, () => {
      expect(isStreamlitConfig(value)).toBe(false);
    });
  });
});
