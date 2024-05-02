import { parseMountOptions, resolveUrl } from "./options";

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

describe("parseMountOptions()", () => {
  it("translates a string input into StliteKernelOptions", () => {
    const { kernelOptions } = parseMountOptions("foo");
    expect(kernelOptions).toEqual({
      entrypoint: "streamlit_app.py",
      files: {
        "streamlit_app.py": {
          data: "foo",
        },
      },
      requirements: [],
      prebuiltPackageNames: [],
      archives: [],
    });
  });

  it("fills `entrypoint`, and `requirements` fields and converts the `files` into the canonical form", () => {
    const { kernelOptions } = parseMountOptions({
      files: {
        "streamlit_app.py": "foo",
        "foo.txt": {
          data: "foo",
        },
        "bar.txt": {
          url: "./bar.txt",
        },
      },
    });
    expect(kernelOptions).toEqual({
      entrypoint: "streamlit_app.py",
      requirements: [],
      prebuiltPackageNames: [],
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
    const { kernelOptions } = parseMountOptions({
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
    });
    expect(kernelOptions).toEqual({
      entrypoint: "streamlit_app.py",
      requirements: [],
      prebuiltPackageNames: [],
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
    const { kernelOptions } = parseMountOptions({
      entrypoint: "foo.py",
      files: {
        "streamlit_app.py": "foo",
      },
    });
    expect(kernelOptions).toEqual({
      entrypoint: "foo.py",
      requirements: [],
      prebuiltPackageNames: [],
      files: {
        "streamlit_app.py": {
          data: "foo",
        },
      },
      archives: [],
    });
  });

  it("preserves the `requirements` option if specified", () => {
    const { kernelOptions } = parseMountOptions({
      requirements: ["matplotlib"],
    });
    expect(kernelOptions).toEqual({
      requirements: ["matplotlib"],
      prebuiltPackageNames: [],
      entrypoint: "streamlit_app.py",
      files: {},
      archives: [],
    });
  });

  it("preserves the `prebuiltPackageNames` option if specified", () => {
    const { kernelOptions } = parseMountOptions({
      prebuiltPackageNames: ["openssl"],
    });
    expect(kernelOptions).toEqual({
      requirements: [],
      prebuiltPackageNames: ["openssl"],
      entrypoint: "streamlit_app.py",
      files: {},
      archives: [],
    });
  });

  it("fills the toast callback options", () => {
    const { toastCallbackOptions } = parseMountOptions("foo");
    expect(toastCallbackOptions).toEqual({
      disableProgressToasts: false,
      disableErrorToasts: false,
    });
  });

  it("passes the toast callback options", () => {
    const { toastCallbackOptions } = parseMountOptions({
      disableProgressToasts: true,
      disableErrorToasts: true,
    });
    expect(toastCallbackOptions).toEqual({
      disableProgressToasts: true,
      disableErrorToasts: true,
    });
  });
});
