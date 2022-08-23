import { getParentUrl } from "./url"

describe("getParentUrl()", () => {
  beforeEach(() => {
    const originalLocation = window.location;
    jest.spyOn(window, "location", "get").mockImplementation(() => ({
      ...originalLocation,
      origin: "https://example.com:3000"
    }))
  });
  afterEach(() => {
    jest.restoreAllMocks()
  });

  const testCases: { input: string; expected: string }[] = [
    {
      input: "https://whitphx.github.io/stlite.js",
      expected: "https://whitphx.github.io/"
    },
    {
      input: "https://whitphx.github.io/stlite/lib/mountable/stlite.js",
      expected: "https://whitphx.github.io/stlite/lib/mountable/"
    },
    {
      input: "./stlite.js",
      expected: "https://example.com:3000/"
    },
    {
      input: "./stlite/lib/mountable/stlite.js",
      expected: "https://example.com:3000/stlite/lib/mountable/"
    },
  ]
  testCases.forEach(({ input, expected }) => {
    it(`extracts "${expected}" from "${input}"`, () => {
      expect(getParentUrl(input)).toEqual(expected)
    })
  })
});
