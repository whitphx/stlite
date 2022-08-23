import { getParentUrl } from "./url"

describe("getParentUrl()", () => {
  const testCases: { input: string; expected: string }[] = [
    {
      input: "https://whitphx.github.io/stlite/lib/mountable/stlite.js",
      expected: "https://whitphx.github.io/stlite/lib/mountable/"
    }
  ]
  testCases.forEach(({ input, expected }) => {
    it(`extracts "${expected}" from "${input}"`, () => {
      expect(getParentUrl(input)).toEqual(expected)
    })
  })
});
