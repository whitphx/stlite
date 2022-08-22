import { canonicalizeOptions } from "./options"

describe("canonicalizeOptions()", () => {
  it("translates a string input into StliteKernelOption", () => {
    expect(canonicalizeOptions("foo")).toEqual({
      command: "run",
      entrypoint: "streamlit_app.py",
      files: {
        "streamlit_app.py": {
          data: "foo"
        }
      }
    })
  })

  it("fills `entrypoint` and `command` fields and converts the `files` into the canonical form", () => {
    expect(canonicalizeOptions({
      files: {
        "streamlit_app.py": "foo"
      }
    })).toEqual({
      command: "run",
      entrypoint: "streamlit_app.py",
      files: {
        "streamlit_app.py": {
          data: "foo"
        }
      }
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
      files: {
        "streamlit_app.py": {
          data: "foo"
        }
      }
    })
  });
})
