import {
  vi,
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  type Mock,
} from "vitest";
import { setupCustomElement, extractFilenameFromUrl } from "./custom-element";

describe("StreamlitApp custom element", () => {
  let mount: Mock;

  beforeAll(() => {
    mount = vi.fn();
    setupCustomElement(mount);
  });

  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.resetAllMocks();
  });

  it("calls mount() with a single file parsed from the textContent of the streamlit-app element", async () => {
    const appElem = document.createElement("streamlit-app");
    appElem.innerHTML = `
  import streamlit as st

  st.write("Hello world")
`;

    container.appendChild(appElem);

    expect(mount).toHaveBeenCalledWith(
      {
        entrypoint: "streamlit_app.py",
        files: {
          "streamlit_app.py": `
import streamlit as st

st.write("Hello world")
`,
        },
        archives: [],
        requirements: [],
        streamlitConfig: {},
      },
      expect.any(HTMLElement),
    );
  });

  it("calls mount() with options parsed from the element", async () => {
    const appElem = document.createElement("streamlit-app");
    appElem.innerHTML = `
<app-file name="app.py" entrypoint>
  import streamlit as st

  st.write("Hello world")
</app-file>
<app-file name="lib.py">
  def foo():
    return "bar"
</app-file>
<app-file name="lib2.py" url="/lib2.py"></app-file>
<app-requirements>
  numpy
</app-requirements>
<app-requirements>
  pandas
</app-requirements>
<app-archive url="foo.zip" format="zip"></app-archive>
<app-archive url="bar.tar.gz" format="tar.gz"></app-archive>
`;

    container.appendChild(appElem);

    expect(mount).toHaveBeenCalledWith(
      {
        entrypoint: "app.py",
        files: {
          "app.py": `
import streamlit as st

st.write("Hello world")
`,
          "lib.py": `
def foo():
  return "bar"
`,
          "lib2.py": {
            url: "/lib2.py",
          },
        },
        archives: [
          { url: "foo.zip", format: "zip" },
          { url: "bar.tar.gz", format: "tar.gz" },
        ],
        requirements: ["numpy", "pandas"],
        streamlitConfig: {},
      },
      expect.any(HTMLElement),
    );
  });

  it("parses <app-file> with url", () => {
    const appElem = document.createElement("streamlit-app");
    appElem.innerHTML = `
<app-file name="app.py" url="/path/to/app.py" entrypoint>
</app-file>
`;

    container.appendChild(appElem);

    expect(mount).toHaveBeenCalledWith(
      {
        entrypoint: "app.py",
        files: {
          "app.py": {
            url: "/path/to/app.py",
            opts: undefined,
          },
        },
        requirements: [],
        archives: [],
        streamlitConfig: {},
      },
      expect.any(HTMLElement),
    );
  });

  it("parses the textContent as the entrypoint file if no other possible child elements are available", async () => {
    const appElem = document.createElement("streamlit-app");
    appElem.innerHTML = `
import streamlit as st

st.write("Hello world")
<app-file name="lib.py">
  def foo():
    return "bar"
</app-file>
<app-file name="lib2.py" url="/lib2.py"></app-file>
<app-requirements>
  numpy
</app-requirements>
<app-requirements>
  pandas
</app-requirements>
<app-archive url="foo.zip" format="zip"></app-archive>
<app-archive url="bar.tar.gz" format="tar.gz"></app-archive>
`;

    container.appendChild(appElem);

    expect(mount).toHaveBeenCalledWith(
      {
        entrypoint: "streamlit_app.py",
        files: {
          "streamlit_app.py": `
import streamlit as st

st.write("Hello world")
`,
          "lib.py": `
def foo():
  return "bar"
`,
          "lib2.py": {
            url: "/lib2.py",
          },
        },
        archives: [
          { url: "foo.zip", format: "zip" },
          { url: "bar.tar.gz", format: "tar.gz" },
        ],
        requirements: ["numpy", "pandas"],
        streamlitConfig: {},
      },
      expect.any(HTMLElement),
    );
  });

  it("loads the entrypoint from src attribute", async () => {
    const appElem = document.createElement("streamlit-app");
    appElem.setAttribute("src", "/path/to/app.py");

    container.appendChild(appElem);

    expect(mount).toHaveBeenCalledWith(
      {
        entrypoint: "app.py",
        files: {
          "app.py": {
            url: expect.stringContaining("/path/to/app.py"),
          },
        },
        requirements: [],
        archives: [],
        streamlitConfig: {},
      },
      expect.any(HTMLElement),
    );
  });

  it("src attribute takes precedence over inline text content", async () => {
    const appElem = document.createElement("streamlit-app");
    appElem.setAttribute("src", "/main.py");
    appElem.innerHTML = `
import streamlit as st
st.write("This should be ignored")
`;

    container.appendChild(appElem);

    expect(mount).toHaveBeenCalledWith(
      {
        entrypoint: "main.py",
        files: {
          "main.py": {
            url: expect.stringContaining("/main.py"),
          },
        },
        requirements: [],
        archives: [],
        streamlitConfig: {},
      },
      expect.any(HTMLElement),
    );
  });

  it("src attribute can be combined with child elements", async () => {
    const appElem = document.createElement("streamlit-app");
    appElem.setAttribute("src", "/main.py");
    appElem.innerHTML = `
<app-file name="utils.py" url="/utils.py"></app-file>
<app-requirements>
  numpy
  pandas
</app-requirements>
<app-archive url="data.zip" format="zip"></app-archive>
`;

    container.appendChild(appElem);

    expect(mount).toHaveBeenCalledWith(
      {
        entrypoint: "main.py",
        files: {
          "main.py": {
            url: expect.stringContaining("/main.py"),
          },
          "utils.py": {
            url: "/utils.py",
            opts: undefined,
          },
        },
        requirements: ["numpy", "pandas"],
        archives: [{ url: "data.zip", format: "zip" }],
        streamlitConfig: {},
      },
      expect.any(HTMLElement),
    );
  });

  it("src attribute ignores entrypoint attribute on app-file", async () => {
    const appElem = document.createElement("streamlit-app");
    appElem.setAttribute("src", "/main.py");
    appElem.innerHTML = `
<app-file name="other.py" entrypoint>
  import streamlit as st
</app-file>
`;

    container.appendChild(appElem);

    expect(mount).toHaveBeenCalledWith(
      {
        entrypoint: "main.py",
        files: {
          "main.py": {
            url: expect.stringContaining("/main.py"),
          },
          "other.py": `
import streamlit as st
`,
        },
        requirements: [],
        archives: [],
        streamlitConfig: {},
      },
      expect.any(HTMLElement),
    );
  });

  it("extracts filename from URL with query string", async () => {
    const appElem = document.createElement("streamlit-app");
    appElem.setAttribute("src", "/app.py?version=1&cache=false");

    container.appendChild(appElem);

    expect(mount).toHaveBeenCalledWith(
      {
        entrypoint: "app.py",
        files: {
          "app.py": {
            url: expect.stringContaining("/app.py"),
          },
        },
        requirements: [],
        archives: [],
        streamlitConfig: {},
      },
      expect.any(HTMLElement),
    );
  });

  it("falls back to streamlit_app.py when src URL has no .py extension", async () => {
    const appElem = document.createElement("streamlit-app");
    appElem.setAttribute("src", "/api/get-app");

    container.appendChild(appElem);

    expect(mount).toHaveBeenCalledWith(
      {
        entrypoint: "streamlit_app.py",
        files: {
          "streamlit_app.py": {
            url: expect.stringContaining("/api/get-app"),
          },
        },
        requirements: [],
        archives: [],
        streamlitConfig: {},
      },
      expect.any(HTMLElement),
    );
  });
});

describe("extractFilenameFromUrl", () => {
  it("extracts filename from simple path", () => {
    expect(extractFilenameFromUrl("/app.py")).toBe("app.py");
  });

  it("extracts filename from nested path", () => {
    expect(extractFilenameFromUrl("/streamlit-pages/index.py")).toBe(
      "index.py",
    );
  });

  it("extracts filename from deeply nested path", () => {
    expect(extractFilenameFromUrl("/a/b/c/main.py")).toBe("main.py");
  });

  it("strips query string from filename", () => {
    expect(extractFilenameFromUrl("/app.py?version=1")).toBe("app.py");
  });

  it("strips query string with multiple params", () => {
    expect(extractFilenameFromUrl("/app.py?v=1&cache=false")).toBe("app.py");
  });

  it("falls back to streamlit_app.py when no .py extension", () => {
    expect(extractFilenameFromUrl("/api/get-app")).toBe("streamlit_app.py");
  });

  it("falls back to streamlit_app.py for directory-like paths", () => {
    expect(extractFilenameFromUrl("/apps/")).toBe("streamlit_app.py");
  });

  it("handles absolute URLs", () => {
    expect(extractFilenameFromUrl("https://example.com/app.py")).toBe("app.py");
  });

  it("handles absolute URLs with paths", () => {
    expect(extractFilenameFromUrl("https://example.com/path/to/main.py")).toBe(
      "main.py",
    );
  });

  it("handles relative URLs", () => {
    expect(extractFilenameFromUrl("./app.py")).toBe("app.py");
  });

  it("handles parent relative URLs", () => {
    expect(extractFilenameFromUrl("../scripts/app.py")).toBe("app.py");
  });

  it("handles URLs with fragments", () => {
    expect(extractFilenameFromUrl("/app.py#section")).toBe("app.py");
  });

  it("handles URLs with both query and fragment", () => {
    expect(extractFilenameFromUrl("/app.py?v=1#section")).toBe("app.py");
  });
});
