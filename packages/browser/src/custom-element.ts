import type { mount as mountFn } from "./mount";
import type { MountOptions, DetailedMountOptions } from "./options";
import { resolveUrl } from "./options";
import { parseRequirementsTxt } from "@stlite/common";
import dedent from "codedent";
import "./custom-element.css";

/**
 * Extracts a filename from a URL path.
 * Examples:
 *   /streamlit-pages/index.py → index.py
 *   /app.py?version=1 → app.py
 *   /api/get-app → streamlit_app.py (fallback)
 */
export function extractFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url, window.location.href);
    const pathname = urlObj.pathname;
    const filename = pathname.split("/").pop() || "";

    // If the filename looks like a Python file, use it
    if (filename.endsWith(".py")) {
      return filename;
    }

    // Fallback to default filename
    return "streamlit_app.py";
  } catch {
    // If URL parsing fails, try simple extraction
    const pathWithoutQuery = url.split("?")[0];
    const filename = pathWithoutQuery.split("/").pop() || "";

    if (filename.endsWith(".py")) {
      return filename;
    }

    return "streamlit_app.py";
  }
}

/*
Supported syntaxes:

## Simple code block
<streamlit-app>
  import streamlit as st

  st.write("Hello world")
</streamlit-app>

## Load from URL using src attribute
<streamlit-app src="/app.py"></streamlit-app>

## src attribute with additional files and requirements
<streamlit-app src="/main.py">
  <app-file name="utils.py" url="/utils.py"></app-file>
  <app-requirements>
    numpy
    pandas
  </app-requirements>
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
      const files: NonNullable<DetailedMountOptions["files"]> = {};
      let requirementsText = "";
      const archives: NonNullable<DetailedMountOptions["archives"]> = [];
      const streamlitConfig: NonNullable<
        DetailedMountOptions["streamlitConfig"]
      > = {};

      // Check for src attribute first - it takes priority over inline content
      const srcUrl = this.getAttribute("src");
      let entrypoint: string | null = null;
      let hasSrcEntrypoint = false;

      if (srcUrl) {
        // Extract filename from URL and use it as entrypoint
        entrypoint = extractFilenameFromUrl(srcUrl);
        hasSrcEntrypoint = true;
        files[entrypoint] = {
          url: resolveUrl(srcUrl),
        };
      }

      const textContents: string[] = [];

      this.childNodes.forEach((node) => {
        if (node instanceof Text) {
          // Skip text content if src attribute is present (like <script src="">)
          if (hasSrcEntrypoint) {
            return;
          }
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

              // Ignore entrypoint attribute on <app-file> if src is present
              if (!hasSrcEntrypoint && node.hasAttribute("entrypoint")) {
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

      // If no src and no <app-file entrypoint>, use inline text content
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
