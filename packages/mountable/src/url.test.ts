import { getParentUrl } from "./url";

describe("getParentUrl()", () => {
  beforeEach(() => {
    const originalLocation = window.location;
    jest.spyOn(window, "location", "get").mockImplementation(() => ({
      ...originalLocation,
      origin: "https://example.com:3000",
    }));
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const testCases: { input: string; expected: string }[] = [
    {
      input: "https://whitphx.github.io/stlite.js",
      expected: "https://whitphx.github.io/",
    },
    {
      input: "https://whitphx.github.io/stlite/lib/mountable/stlite.js",
      expected: "https://whitphx.github.io/stlite/lib/mountable/",
    },
    {
      // A relative URL is resolved based on window.location.origin.
      input: "./stlite.js",
      expected: "https://example.com:3000/",
    },
    {
      // A relative URL is resolved based on window.location.origin.
      input: "./stlite/lib/mountable/stlite.js",
      expected: "https://example.com:3000/stlite/lib/mountable/",
    },
    {
      // An empty URL is treated as "./"
      input: "",
      expected: "https://example.com:3000/",
    },
  ];
  testCases.forEach(({ input, expected }) => {
    it(`extracts "${expected}" from "${input}"`, () => {
      expect(getParentUrl(input)).toEqual(expected);
    });
  });
});
