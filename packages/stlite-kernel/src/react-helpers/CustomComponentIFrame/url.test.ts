import { describe, it, expect } from "vitest";
import { getRelativePath } from "./url";

describe("getRelativePath", () => {
  const testCases: { baseHost: string; basePathname: string; url: URL }[] = [
    {
      baseHost: "localhost:3000",
      basePathname: "/index.html",
      url: new URL("http://localhost:3000/" + "./foo.js"),
    },
    {
      baseHost: "localhost:3000",
      basePathname: "/stlite/index.html",
      url: new URL("http://localhost:3000/stlite/" + "./foo.js"),
    },
    {
      baseHost: "localhost:3000",
      basePathname: "/",
      url: new URL("http://localhost:3000/" + "./foo.js"),
    },
    {
      baseHost: "localhost:3000",
      basePathname: "/stlite/",
      url: new URL("http://localhost:3000/stlite/" + "./foo.js"),
    },
  ];
  testCases.forEach(({ baseHost, basePathname, url }) => {
    it(`extracts path relative to (${baseHost}${basePathname}) from ${url}`, () => {
      expect(getRelativePath(baseHost, basePathname, url)).toEqual("foo.js");
    });
  });
});
