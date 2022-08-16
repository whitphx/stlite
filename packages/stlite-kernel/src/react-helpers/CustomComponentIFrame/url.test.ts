import { describe, it, expect } from "vitest";
import { extractCustomComponentPath, getRelativePath } from "./url";

describe("extractCustomComponentPath", () => {
  const testCases: {
    basePathname: string;
    url: string;
    expected: string;
  }[] = [
    {
      basePathname: "/",
      url: "http://xxx:99999/component/package.component/index.html?streamlitUrl=http%3A%2F%2Flocalhost%3A3000%2F",
      expected:
        "/component/package.component/index.html?streamlitUrl=http%3A%2F%2Flocalhost%3A3000%2F",
    },
    {
      basePathname: "/stlite",
      url: "http://xxx:99999/stlite/component/streamlit_ace.streamlit_ace/index.html?streamlitUrl=http%3A%2F%2Flocalhost%3A3000%2Fstlite",
      expected:
        "/component/streamlit_ace.streamlit_ace/index.html?streamlitUrl=http%3A%2F%2Flocalhost%3A3000%2Fstlite",
    },
    {
      basePathname: "/stlite/index.html",
      url: "http://xxx:99999/stlite/index.html/component/streamlit_ace.streamlit_ace/index.html?streamlitUrl=http%3A%2F%2Flocalhost%3A3000%2Fstlite%2Findex.html",
      expected:
        "/component/streamlit_ace.streamlit_ace/index.html?streamlitUrl=http%3A%2F%2Flocalhost%3A3000%2Fstlite%2Findex.html",
    },
    {
      basePathname: "/index.html",
      url: "http://xxx:99999/index.html/component/streamlit_ace.streamlit_ace/index.html?streamlitUrl=http%3A%2F%2Flocalhost%3A3000%2Findex.html",
      expected:
        "/component/streamlit_ace.streamlit_ace/index.html?streamlitUrl=http%3A%2F%2Flocalhost%3A3000%2Findex.html",
    },
  ];

  testCases.forEach(({ basePathname, url, expected }) => {
    it(`extracts ${expected} from ${url} under the base path ${basePathname}`, () => {
      expect(extractCustomComponentPath(basePathname, url)).toEqual(expected);
    });
  });
});

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
