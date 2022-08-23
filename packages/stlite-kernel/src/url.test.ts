import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { makeAbsoluteWheelURL } from "./url";

describe("makeAbsoluteWheelURL", () => {
  beforeEach(() => {
    const originalLocation = window.location;
    vi.spyOn(window, "location", "get").mockImplementation(() => ({
      ...originalLocation,
      origin: "https://example.com:3000",
    }));
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  const testCases: { wheelUrl: string; baseUrl?: string; expected: string }[] =
    [
      {
        // Absolute path is resolved based on window.location.origin
        wheelUrl: "/whitphx/stlite/pypi/stlite_pyarrow-0.1.0-py3-none-any.whl",
        expected:
          "https://example.com:3000/whitphx/stlite/pypi/stlite_pyarrow-0.1.0-py3-none-any.whl",
      },
      {
        // Absolute path with baseURL is resolved based on the baseURL's origin.
        wheelUrl: "/whitphx/stlite/pypi/stlite_pyarrow-0.1.0-py3-none-any.whl",
        baseUrl: "https://whitphx.github.io/stlite",
        expected:
          "https://whitphx.github.io/whitphx/stlite/pypi/stlite_pyarrow-0.1.0-py3-none-any.whl",
      },
      {
        // Absolute URL is returned as-is.
        wheelUrl:
          "https://whitphx.github.io/stlite/pypi/stlite_pyarrow-0.1.0-py3-none-any.whl",
        expected:
          "https://whitphx.github.io/stlite/pypi/stlite_pyarrow-0.1.0-py3-none-any.whl",
      },
      {
        // Relative path is resolved based on the baseURL.
        wheelUrl: "./pypi/stlite_pyarrow-0.1.0-py3-none-any.whl",
        baseUrl: "http://example.com:3000/build/",
        expected:
          "http://example.com:3000/build/pypi/stlite_pyarrow-0.1.0-py3-none-any.whl",
      },
    ];
  testCases.forEach(({ wheelUrl, baseUrl, expected }) => {
    it(`resolves the wheel URL (${wheelUrl}) as an absolute URL (${expected}) with a hint of baseUrl (${baseUrl})`, () => {
      expect(makeAbsoluteWheelURL(wheelUrl, baseUrl)).toEqual(expected);
    });
  });
});
