import * as s from "superstruct";
import { DesktopAppManifestStruct } from "./manifest";

describe("DesktopAppManifestStruct", () => {
  it("should coerce an empty object", () => {
    expect(s.create({}, DesktopAppManifestStruct)).toEqual(
      expect.objectContaining({ embed: false, nodeJsWorker: false })
    );
  });
});
