import { canonicalizeMountOptions } from "./options";

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
    });
  });

  it("fills `command`, `entrypoint`, and `requirements` fields and converts the `files` into the canonical form", () => {
    expect(
      canonicalizeMountOptions({
        files: {
          "streamlit_app.py": "foo",
        },
      })
    ).toEqual({
      entrypoint: "streamlit_app.py",
      requirements: [],
      files: {
        "streamlit_app.py": {
          data: "foo",
        },
      },
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
    });
  });
});
