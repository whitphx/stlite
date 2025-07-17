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
import { setupCustomElement } from "./custom-element";

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
});
