import { setupCustomElement } from "./custom-element";

describe("StreamlitApp custom element", () => {
  let mount: jest.Mock;

  beforeAll(() => {
    mount = jest.fn();
    setupCustomElement(mount);
  });

  beforeEach(() => {
    document.body.innerHTML = "";
    mount.mockClear();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("calls mount() with a single file parsed from the textContent of the streamlit-app element", async () => {
    document.body.innerHTML = `
<streamlit-app>
  import streamlit as st

  st.write("Hello world")
</streamlit-app>
`;

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
    document.body.innerHTML = `
<streamlit-app>
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
</streamlit-app>
`;

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

  it("parses the textContent as the entrypoint file if no other possible child elements are available", async () => {
    document.body.innerHTML = `
<streamlit-app>
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
</streamlit-app>
`;

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
