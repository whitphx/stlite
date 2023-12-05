import { canonicalizeMountOptions, resolveUrl } from "./options";

describe("resolveUrl()", () => {
  let windowSpy: jest.SpyInstance;
  let setLocationHref: (href: string) => void;

  beforeEach(() => {
    const originalWindow = { ...window };
    windowSpy = jest.spyOn(window, "window", "get");
    setLocationHref = (href) => {
      windowSpy.mockImplementation(() => ({
        ...originalWindow,
        location: {
          ...originalWindow.location,
          href,
        },
      }));
    };
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  const testCases = [
    {
      baseHref: "http://localhost/",
      url: "foo",
      expected: "http://localhost/foo",
    },
    {
      baseHref: "http://localhost:3000/",
      url: "foo",
      expected: "http://localhost:3000/foo",
    },
    {
      baseHref: "http://localhost:3000/index.html",
      url: "foo",
      expected: "http://localhost:3000/foo",
    },
    {
      baseHref: "http://localhost:3000/bar/",
      url: "./foo",
      expected: "http://localhost:3000/bar/foo",
    },
  ];
  testCases.forEach(({ baseHref, url, expected }) => {
    it(`resolves a relative URL "${url}" with a base URL "${baseHref}"`, () => {
      setLocationHref(baseHref);
      expect(resolveUrl(url)).toEqual(expected);
    });
  });
});

describe("canonicalizeMountOptions()", () => {
  it("translates a string input into StliteKernelOptions", () => {
    expect(canonicalizeMountOptions("foo")).toEqual({
      entrypoint: "streamlit_app.py",
      files: {
        "streamlit_app.py": {
          data: "foo",
        },
      },
      requirements: [],
      archives: [],
    });
  });

  it("fills `command`, `entrypoint`, and `requirements` fields and converts the `files` into the canonical form", () => {
    expect(
      canonicalizeMountOptions({
        files: {
          "streamlit_app.py": "foo",
          "foo.txt": {
            data: "foo",
          },
          "bar.txt": {
            url: "./bar.txt",
          },
        },
      })
    ).toEqual({
      entrypoint: "streamlit_app.py",
      requirements: [],
      files: {
        "streamlit_app.py": {
          data: "foo",
        },
        "foo.txt": {
          data: "foo",
        },
        "bar.txt": {
          url: "http://localhost/bar.txt",
        },
      },
      archives: [],
    });
  });

  it("normalizes the archives field", () => {
    expect(
      canonicalizeMountOptions({
        archives: [
          {
            url: "./foo.zip",
            format: "zip",
            options: {},
          },
          {
            url: "https://example.com/bar.zip",
            format: "zip",
            options: {},
          },
          {
            buffer: new Uint8Array([1, 2, 3]),
            format: "zip",
            options: {},
          },
        ],
      })
    ).toEqual({
      entrypoint: "streamlit_app.py",
      requirements: [],
      files: {},
      archives: [
        {
          url: "http://localhost/foo.zip",
          format: "zip",
          options: {},
        },
        {
          url: "https://example.com/bar.zip",
          format: "zip",
          options: {},
        },
        {
          buffer: new Uint8Array([1, 2, 3]),
          format: "zip",
          options: {},
        },
      ],
    });
  });

  it("preserves the `entrypoint` field if specified", () => {
    expect(
      canonicalizeMountOptions({
        entrypoint: "foo.py",
        files: {
          "streamlit_app.py": "foo",
        },
      })
    ).toEqual({
      entrypoint: "foo.py",
      requirements: [],
      files: {
        "streamlit_app.py": {
          data: "foo",
        },
      },
      archives: [],
    });
  });

  it("preserves the `requirements` option if specified", () => {
    expect(
      canonicalizeMountOptions({
        requirements: ["matplotlib"],
      })
    ).toEqual({
      requirements: ["matplotlib"],
      entrypoint: "streamlit_app.py",
      files: {},
      archives: [],
    });
  });
});
