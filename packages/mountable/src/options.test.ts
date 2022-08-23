import { canonicalizeOptions } from "./options"

describe("canonicalizeOptions()", () => {
  it("translates a string input into StliteKernelOptions", () => {
    expect(canonicalizeOptions("foo")).toEqual({
      command: "run",
      entrypoint: "streamlit_app.py",
      files: {
        "streamlit_app.py": {
          data: "foo"
        }
      },
      requirements: [],
    })
  })

  it("fills `command`, `entrypoint`, and `requirements` fields and converts the `files` into the canonical form", () => {
    expect(canonicalizeOptions({
      files: {
        "streamlit_app.py": "foo"
      }
    })).toEqual({
      command: "run",
      entrypoint: "streamlit_app.py",
      requirements: [],
      files: {
        "streamlit_app.py": {
          data: "foo"
        }
      },
    })
  })

  it("preserves the `entrypoint` field if specified", () => {
    expect(canonicalizeOptions({
      entrypoint: "foo.py",
      files: {
        "streamlit_app.py": "foo"
      }
    })).toEqual({
      command: "run",
      entrypoint: "foo.py",
      requirements: [],
      files: {
        "streamlit_app.py": {
          data: "foo"
        }
      },
    })
  });

  it("preserves the `requirements` option if specified", () => {
    expect(canonicalizeOptions({
      requirements: ["matplotlib"]
    })).toEqual({
      command: "run",
      requirements: ["matplotlib"],
      entrypoint: "streamlit_app.py",
      files: {}
    })
  })
})
