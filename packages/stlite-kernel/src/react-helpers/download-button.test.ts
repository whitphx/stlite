import { describe, it, expect } from "vitest";
import { parseContentDispositionHeader } from "./download-button";

describe("parseContentDispositionHeader", () => {
  it("extracts filename from the given ContentDisposition header value", () => {
    expect(
      parseContentDispositionHeader(
        `attachment; filename="StreamlitApp_2022-08-12_14-44-14.bin"`
      )
    ).toEqual("StreamlitApp_2022-08-12_14-44-14.bin");
  });
});
