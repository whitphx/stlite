import { exportAsHtml } from "./html";
import { JSDOM } from "jsdom";
import { AppData } from "@stlite/sharing-common/dist";

const jsdom = new JSDOM();
const parser = new jsdom.window.DOMParser();

describe("exportAsHtml", () => {
  it("returns a valid HTML string containing necessary elements", () => {
    const appData: AppData = {
      entrypoint: "streamlit_app.py",
      files: {
        "streamlit_app.py": {
          content: {
            $case: "text",
            text: `import streamlit as st\nst.write("Hello World")`
          }
        }
      },
      requirements: []
    };
    const result = exportAsHtml(appData);
    const dom = parser.parseFromString(result, "text/html");

    const rootDiv = dom.getElementById("root");
    expect(rootDiv?.tagName).toEqual("DIV");

    const linkTags = dom.head.getElementsByTagName("link");
    expect(linkTags.length).toBe(1);
    expect(linkTags[0].rel).toEqual("stylesheet");
    expect(linkTags[0].href).toEqual(
      "https://cdn.jsdelivr.net/npm/@stlite/mountable@0.14.0/build/stlite.css"
    ); // TODO: Set the version dynamically

    const scriptTags = dom.body.getElementsByTagName("script");
    expect(scriptTags.length).toBe(2);

    const stliteLoaderScriptTag = scriptTags[0];
    expect(stliteLoaderScriptTag.src).toEqual(
      "https://cdn.jsdelivr.net/npm/@stlite/mountable@0.14.0/build/stlite.js"
    );
    expect(stliteLoaderScriptTag.text).toEqual("");

    const appScriptTag = scriptTags[1];
    expect(appScriptTag.src).toEqual("");
    const appScriptContent = appScriptTag.text;
    expect(appScriptContent).not.toEqual(""); // TODO: Analyze the AST of the JS source
  });
});
