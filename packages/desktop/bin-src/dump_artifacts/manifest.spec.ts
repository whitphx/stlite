import { describe, it, expect } from "vitest";
import { coerceDesktopAppManifest } from "./manifest";

describe("coerceDesktopAppManifest", () => {
  it("should require the entrypoint field and coerce the remaining fields", () => {
    expect(
      coerceDesktopAppManifest({
        entrypoint: "foo.py",
      }),
    ).toEqual({ entrypoint: "foo.py", embed: false, nodeJsWorker: false });
  });

  it("should throw an error when `idbfsMountpoints` is set with `nodeJsWorker` is true", () => {
    expect(() =>
      coerceDesktopAppManifest({
        entrypoint: "foo.py",
        nodeJsWorker: true,
        idbfsMountpoints: ["foo"],
      }),
    ).toThrowError();
  });

  it("should throw an error when `nodefsMountpoints` is set with `nodeJsWorker` is false", () => {
    expect(() =>
      coerceDesktopAppManifest({
        entrypoint: "foo.py",
        nodeJsWorker: false,
        nodefsMountpoints: { foo: "bar" },
      }),
    ).toThrowError();
  });
});
