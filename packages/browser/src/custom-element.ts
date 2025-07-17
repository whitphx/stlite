import type { mount as mountFn } from "./mount";
import type { MountOptions, DetailedMountOptions } from "./options";
import { parseRequirementsTxt } from "@stlite/common";
import dedent from "codedent";
import "./custom-element.css";

/*
Supported syntaxes:
## Simple code block
<streamlit-app>
  import streamlit as st

  st.write("Hello world")
</streamlit-app>

## More configurable syntax with child elements
<streamlit-app>
  <app-file name="app.py" entrypoint>
    import streamlit as st

    st.write("Hello world")
  </app-file>

  <app-file name="lib.py">
    def foo():
      return "bar"
  </app-file>

  <app-requirements>
    numpy
  </app-requirements>

  <app-requirements>
    pandas
  </app-requirements>

  <app-archive url="foo.zip" format="zip"></app-archive>
  <app-archive url="bar.tar.gz" format="tar.gz"></app-archive>
</streamlit-app>
*/

export function setupCustomElement(mount: typeof mountFn) {
  class StliteAppElement extends HTMLElement {
    private _controller: ReturnType<typeof mountFn> | null = null;

    connectedCallback() {
      const mountOptions = this.parseOptions();

      // Now we mount the app to the body.
      // Encapsulation using Shadow DOM requires more work such as
      // applying styles to the shadow root.
      // TODO: Implement encapsulation using Shadow DOM.
      const container = document.createElement("div");
      container.classList.add("stlite-app-container");
      this.appendChild(container);

      this._controller = mount(mountOptions, container);

      this.style.display = "block";
    }

    parseOptions = (): MountOptions => {
      let entrypoint: string | null = null;
      const files: NonNullable<DetailedMountOptions["files"]> = {};
      let requirementsText = "";
      const archives: NonNullable<DetailedMountOptions["archives"]> = [];
      const streamlitConfig: NonNullable<
        DetailedMountOptions["streamlitConfig"]
      > = {};
      const textContents: string[] = [];

      this.childNodes.forEach((node) => {
        if (node instanceof Text) {
          const textContent = node.textContent;
          if (textContent == null) {
            return;
          }
          const isEmpty = textContent.replace(/\s*/g, "") === "";
          if (isEmpty) {
            return;
          }
          textContents.push(textContent);
          return;
        } else if (node instanceof HTMLElement) {
          switch (node.tagName) {
            case "APP-FILE": {
              const name = node.getAttribute("name");
              if (!name) {
                throw new Error("Attribute 'name' is required for <app-file>");
              }
              if (files[name]) {
                throw new Error(`File with name '${name}' already exists`);
              }

              if (node.hasAttribute("entrypoint")) {
                if (entrypoint) {
                  throw new Error("Multiple entrypoints are not allowed");
                }
                entrypoint = name;
              }

              const url = node.getAttribute("url");
              const encoding = node.getAttribute("encoding");
              if (url) {
                files[name] = {
                  url,
                  opts: encoding ? { encoding } : undefined,
                };
              } else {
                files[name] = node.textContent ? dedent(node.textContent) : "";
              }
              return;
            }
            case "APP-REQUIREMENTS": {
              requirementsText += node.textContent
                ? dedent(node.textContent)
                : "";
              return;
            }
            case "APP-ARCHIVE": {
              const url = node.getAttribute("url");
              const format = node.getAttribute("format");
              if (!url || !format) {
                throw new Error(
                  "Attributes 'url' and 'format' are required for <app-archive>",
                );
              }
              archives.push({ url, format });
              return;
            }
            // Now we don't support setting `streamlitConfig` from the custom element
            // because it's possible to set it from files[".streamlit/config.toml"].
            // case "APP-CONFIG": {
            //   return;
            // }
          }
        }
      });

      if (entrypoint === null) {
        if (textContents.length === 0) {
          throw new Error("No content found");
        }

        entrypoint = "streamlit_app.py";
        files[entrypoint] = dedent(textContents[0]);
      }

      if (!entrypoint) {
        throw new Error("Entrypoint is required");
      }

      const otherMountOptions: Partial<DetailedMountOptions> = {};
      if (this.hasAttribute("shared-worker")) {
        otherMountOptions.sharedWorker = true;
      }

      return {
        ...otherMountOptions,
        entrypoint,
        files,
        requirements: parseRequirementsTxt(requirementsText),
        archives,
        streamlitConfig,
      };
    };

    disconnectedCallback() {
      this._controller?.unmount();
    }
  }

  customElements.define("streamlit-app", StliteAppElement);
}
