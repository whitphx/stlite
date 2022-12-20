import { exportAsHtml } from "./html";
import { JSDOM } from "jsdom";
import * as babelParser from "@babel/parser";
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
            text: `import streamlit as st\nst.write("Hello World")`,
          },
        },
      },
      requirements: [],
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

    const jsAstRoot = babelParser.parse(appScriptContent);
    // The source code only includes `stlite.mount()`.
    expect(jsAstRoot.program.body.length).toBe(1);
    expect(jsAstRoot.program.body[0].expression.callee.object.name).toEqual(
      "stlite"
    );
    expect(jsAstRoot.program.body[0].expression.callee.property.name).toEqual(
      "mount"
    );

    expect(jsAstRoot.program.body[0].expression.arguments.length).toBe(2);
    const [mountOptions, mountTarget] =
      jsAstRoot.program.body[0].expression.arguments;

    expect(mountTarget).toEqual(
      expect.objectContaining({
        type: "CallExpression",
        callee: expect.objectContaining({
          type: "MemberExpression",
          object: expect.objectContaining({
            type: "Identifier",
            name: "document",
          }),
          property: expect.objectContaining({
            type: "Identifier",
            name: "getElementById",
          }),
        }),
        arguments: [
          expect.objectContaining({
            type: "StringLiteral",
            value: "root",
          }),
        ],
      })
    );

    const expectedRequirements = appData.requirements;
    const expectedEntrypoint = appData.entrypoint;

    expect(mountOptions).toEqual(
      expect.objectContaining({
        type: "ObjectExpression",
        properties: [
          expect.objectContaining({
            type: "ObjectProperty",
            key: expect.objectContaining({
              type: "Identifier",
              name: "requirements",
            }),
            value: expect.objectContaining({
              type: "ArrayExpression",
              elements: expectedRequirements,
            }),
          }),
          expect.objectContaining({
            type: "ObjectProperty",
            key: expect.objectContaining({
              type: "Identifier",
              name: "entrypoint",
            }),
            value: expect.objectContaining({
              type: "StringLiteral",
              value: expectedEntrypoint,
            }),
          }),
          expect.objectContaining({
            type: "ObjectProperty",
            key: expect.objectContaining({
              type: "Identifier",
              name: "files",
            }),
            value: expect.objectContaining({
              type: "ObjectExpression",
              properties: [
                expect.objectContaining({
                  type: "ObjectProperty",
                  key: expect.objectContaining({
                    type: "StringLiteral",
                    value: "streamlit_app.py",
                  }),
                  // Value will be checked below.
                }),
              ],
            }),
          }),
        ],
      })
    );
    expect(
      mountOptions.properties[2].value.properties[0].value.quasis[0].value.raw
    ).toEqual("\n" + appData.files["streamlit_app.py"].content!.text + "\n");
  });
});
