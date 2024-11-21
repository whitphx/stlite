import { describe, it, expect } from "vitest";
import { getFileNameFromContentDispositionHeader } from "./download-button";

describe("getFileNameFromContentDispositionHeader", () => {
  [
    {
      header: `attachment; filename="StreamlitApp_2022-08-12_14-44-14.bin"`,
      expected: "StreamlitApp_2022-08-12_14-44-14.bin",
    },
    {
      header: "attachment; filename*=utf-8''%E3%83%86%E3%82%B9%E3%83%88.png",
      expected: "テスト.png",
    },
  ].forEach(({ header, expected }) => {
    it(`extracts filename ("${expected}") from the given ContentDisposition header value ("${header}")`, () => {
      expect(getFileNameFromContentDispositionHeader(header)).toEqual(expected);
    });
  });
});
