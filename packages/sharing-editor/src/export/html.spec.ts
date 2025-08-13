import { describe, it, expect } from "vitest";
import { exportAsHtml, escapeTextForJsTemplateLiteral } from "./html";
import { JSDOM } from "jsdom";
import * as babelParser from "@babel/parser";
import { AppData } from "@stlite/sharing-common/dist";

const jsdom = new JSDOM();
const parser = new jsdom.window.DOMParser();

describe("exportAsHtml", () => {
  it("returns a valid HTML string containing necessary elements and the stlite.mount() call", () => {
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
      `https://cdn.jsdelivr.net/npm/@stlite/browser@${SELF_HOSTING_RUNTIME_VERSION}/build/stlite.css`,
    );

    const scriptTags = dom.body.getElementsByTagName("script");
    expect(scriptTags.length).toBe(1);

    const appScriptTag = scriptTags[0];
    expect(appScriptTag.src).toEqual("");
    expect(appScriptTag.type).toEqual("module");

    const appScriptContent = appScriptTag.text;

    const jsAstRoot = babelParser.parse(appScriptContent, {
      sourceType: "module",
    });
    // The source code contains an import and the `mount()` call.
    expect(jsAstRoot.program.body.length).toBe(2);

    const [importMount, mountCall] = jsAstRoot.program.body;

    expect(importMount).toEqual(
      expect.objectContaining({
        type: "ImportDeclaration",
        source: expect.objectContaining({
          type: "StringLiteral",
          value: `https://cdn.jsdelivr.net/npm/@stlite/browser@${SELF_HOSTING_RUNTIME_VERSION}/build/stlite.js`,
        }),
        specifiers: [
          expect.objectContaining({
            type: "ImportSpecifier",
            imported: expect.objectContaining({
              type: "Identifier",
              name: "mount",
            }),
            local: expect.objectContaining({
              type: "Identifier",
              name: "mount",
            }),
          }),
        ],
      }),
    );

    expect(mountCall).toEqual(
      expect.objectContaining({
        type: "ExpressionStatement",
        expression: expect.objectContaining({
          type: "CallExpression",
          callee: expect.objectContaining({
            type: "Identifier",
            name: "mount",
          }),
        }),
      }),
    );
    if (
      mountCall.type !== "ExpressionStatement" ||
      mountCall.expression.type !== "CallExpression"
    ) {
      throw new Error();
    }

    expect(mountCall.expression.arguments.length).toBe(2);
    const [mountOptions, mountTarget] = mountCall.expression.arguments;

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
      }),
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
                  value: expect.objectContaining({
                    quasis: [
                      expect.objectContaining({
                        value: expect.objectContaining({
                          // @ts-expect-error The content field is a discriminated union type and TypeScript cannot infer the text field exists
                          raw: appData.files["streamlit_app.py"].content.text,
                        }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        ],
      }),
    );
  });

  it("returns a valid HTML string containing necessary elements, the stlite.mount() call, and a func definition of binary decoder if binary data included", () => {
    const appData: AppData = {
      entrypoint: "streamlit_app.py",
      files: {
        "streamlit_app.py": {
          content: {
            $case: "text",
            text: `import streamlit as st\nst.write("Hello World")`,
          },
        },
        "foo.dat": {
          content: {
            $case: "data",
            data: new Uint8Array([1, 2, 3, 4]),
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
      `https://cdn.jsdelivr.net/npm/@stlite/browser@${SELF_HOSTING_RUNTIME_VERSION}/build/stlite.css`,
    );

    const scriptTags = dom.body.getElementsByTagName("script");
    expect(scriptTags.length).toBe(1);

    const appScriptTag = scriptTags[0];
    expect(appScriptTag.src).toEqual("");
    expect(appScriptTag.type).toEqual("module");
    const appScriptContent = appScriptTag.text;

    const jsAstRoot = babelParser.parse(appScriptContent, {
      sourceType: "module",
    });
    // The source contains the import syntax, `mount()` call, and the Base64 decoder function definition.
    expect(jsAstRoot.program.body.length).toBe(3);

    const [importMount, mountCall, funcDef] = jsAstRoot.program.body;

    expect(importMount).toEqual(
      expect.objectContaining({
        type: "ImportDeclaration",
        source: expect.objectContaining({
          type: "StringLiteral",
          value: `https://cdn.jsdelivr.net/npm/@stlite/browser@${SELF_HOSTING_RUNTIME_VERSION}/build/stlite.js`,
        }),
        specifiers: [
          expect.objectContaining({
            type: "ImportSpecifier",
            imported: expect.objectContaining({
              type: "Identifier",
              name: "mount",
            }),
            local: expect.objectContaining({
              type: "Identifier",
              name: "mount",
            }),
          }),
        ],
      }),
    );

    expect(mountCall).toEqual(
      expect.objectContaining({
        type: "ExpressionStatement",
        expression: expect.objectContaining({
          type: "CallExpression",
          callee: expect.objectContaining({
            type: "Identifier",
            name: "mount",
          }),
        }),
      }),
    );
    if (
      mountCall.type !== "ExpressionStatement" ||
      mountCall.expression.type !== "CallExpression"
    ) {
      throw new Error();
    }

    expect(mountCall.expression.arguments.length).toBe(2);
    const [mountOptions, mountTarget] = mountCall.expression.arguments;

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
      }),
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
                  value: expect.objectContaining({
                    quasis: [
                      expect.objectContaining({
                        value: expect.objectContaining({
                          // @ts-expect-error The content field is a discriminated union type and TypeScript cannot infer the text field exists
                          raw: appData.files["streamlit_app.py"].content.text,
                        }),
                      }),
                    ],
                  }),
                }),
                expect.objectContaining({
                  type: "ObjectProperty",
                  key: expect.objectContaining({
                    type: "StringLiteral",
                    value: "foo.dat",
                  }),
                  value: expect.objectContaining({
                    type: "CallExpression",
                    callee: expect.objectContaining({
                      type: "Identifier",
                      name: "base64ToU8A",
                    }),
                    arguments: [
                      expect.objectContaining({
                        type: "StringLiteral",
                        value: "AQIDBA==", // A base64-encoded value of `foo.dat`.
                      }),
                    ],
                  }),
                }),
              ],
            }),
          }),
        ],
      }),
    );

    expect(funcDef).toEqual(
      expect.objectContaining({
        type: "FunctionDeclaration",
        id: expect.objectContaining({
          type: "Identifier",
          name: "base64ToU8A",
        }),
      }),
    );
  });
});

describe("escapeTextForJsTemplateLiteral", () => {
  [
    "`hello`", // Backtick

    "Hello ${world}!", // Placeholder
    "\\hello\\", // Backslash
  ].forEach((text) => {
    it(`escapes ${text} correctly`, () => {
      const escaped = escapeTextForJsTemplateLiteral(text);
      const parsed = eval("`" + escaped + "`");
      expect(parsed).toEqual(text);
    });
  });
});
