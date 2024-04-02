import { coerceDesktopAppManifest } from "./manifest";

describe("coerceDesktopAppManifest", () => {
  it("should coerce a null value", () => {
    expect(coerceDesktopAppManifest(null)).toEqual(
      expect.objectContaining({ embed: false, nodeJsWorker: false })
    );
  });

  it("should coerce an empty object", () => {
    expect(coerceDesktopAppManifest({})).toEqual(
      expect.objectContaining({ embed: false, nodeJsWorker: false })
    );
  });

  it("should throw an error when `idbfsMountpoints` is set with `nodeJsWorker` is true", () => {
    expect(() =>
      coerceDesktopAppManifest({
        nodeJsWorker: true,
        idbfsMountpoints: ["foo"],
      })
    ).toThrowError();
  });

  it("should throw an error when `nodefsMountpoints` is set with `nodeJsWorker` is false", () => {
    expect(() =>
      coerceDesktopAppManifest({
        nodeJsWorker: false,
        nodefsMountpoints: { foo: "bar" },
      })
    ).toThrowError();
  });
});
