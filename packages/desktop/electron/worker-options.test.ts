import { loadNodefsMountpoints } from "./worker-options";

describe("loadNodefsMountpoints", () => {
  it("should return undefined if NODEFS_MOUNTPOINTS is not set", () => {
    expect(loadNodefsMountpoints()).toBeUndefined();
  });

  it("should return undefined if NODEFS_MOUNTPOINTS is not valid JSON", () => {
    process.env.NODEFS_MOUNTPOINTS = "{";
    expect(loadNodefsMountpoints()).toBeUndefined();
  });

  it("should return undefined if NODEFS_MOUNTPOINTS is not an object", () => {
    process.env.NODEFS_MOUNTPOINTS = "[]";
    expect(loadNodefsMountpoints()).toBeUndefined();
  });

  it("should return undefined if NODEFS_MOUNTPOINTS has non-string values", () => {
    process.env.NODEFS_MOUNTPOINTS = JSON.stringify({ foo: 1 });
    expect(loadNodefsMountpoints()).toBeUndefined();
  });

  it("should return the parsed NODEFS_MOUNTPOINTS", () => {
    process.env.NODEFS_MOUNTPOINTS = JSON.stringify({ foo: "bar" });
    expect(loadNodefsMountpoints()).toEqual({ foo: "bar" });
  });
});
