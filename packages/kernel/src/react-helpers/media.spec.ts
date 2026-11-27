import { describe, expect, it } from "vitest";
import { getStliteServedPath } from "./media";

describe("getStliteServedPath", () => {
  it.each([
    ["/media/abc.png", "/media/abc.png"],
    ["/media/abc.png?x=1", "/media/abc.png?x=1"],
    ["./app/static/logo.png", "/app/static/logo.png"],
    ["app/static/logo.png", "/app/static/logo.png"],
    ["/app/static/logo.png", "/app/static/logo.png"],
    [
      "./app/static/sub/my%20image.png?v=1",
      "/app/static/sub/my%20image.png?v=1",
    ],
    ["./app/static/logo.svg#icon", "/app/static/logo.svg"],
  ])("returns the kernel path for %s", (rawUrl, expected) => {
    expect(getStliteServedPath(rawUrl)).toBe(expected);
  });

  it.each([
    "https://example.com/app/static/logo.png",
    "data:image/png;base64,AAAA",
    "blob:https://example.com/1234",
    "./static/logo.png",
    "../app/static/logo.png",
    "/myapp/app/static/logo.png",
    "./app/statics/logo.png",
  ])("returns null for %s", (rawUrl) => {
    expect(getStliteServedPath(rawUrl)).toBeNull();
  });
});
