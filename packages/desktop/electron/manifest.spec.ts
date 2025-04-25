import { describe, it, expect } from "vitest";
import { resolveNodefsMountpoints } from "./manifest";

describe("resolveNodefsMountpoints", () => {
  it("should resolve nodefs mountpoint paths with the special placeholders", () => {
    const app = {
      getPath: (placeholder: string) => {
        if (placeholder === "xxx") {
          throw new Error("Unknown placeholder");
        }
        return `/path/to/${placeholder}`;
      },
    } as Electron.App;

    const nodefsMountpoints = {
      home: "{{home}}",
      homeSubdir: "{{home}}/subdir",
      appData: "{{appData}}",
      appDataSubdir: "{{appData}}/subdir",
      unknown: "{{xxx}}",
      unknownSubdir: "{{xxx}}/subdir",
    };

    const resolvedNodefsMountpoints = resolveNodefsMountpoints(
      app,
      nodefsMountpoints,
    );

    expect(resolvedNodefsMountpoints).toEqual({
      home: "/path/to/home",
      homeSubdir: "/path/to/home/subdir",
      appData: "/path/to/appData",
      appDataSubdir: "/path/to/appData/subdir",
      unknown: "{{xxx}}",
      unknownSubdir: "{{xxx}}/subdir",
    });
  });
});
