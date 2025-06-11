import type { editor, Position, languages } from "monaco-editor";
import { CompletionItemKind } from "./types";
import type {
  CodeCompletionRequest,
  CodeCompletionResponse,
} from "@stlite/sharing-common/src/messages";

const nonPythonEntityCharRegex = /[^a-zA-Z0-9_]/;

export type CodeCompletionCallback = (
  payload: CodeCompletionRequest,
) => Promise<CodeCompletionResponse>;

function getCompletionItemKind(type: string): CompletionItemKind {
  switch (type) {
    case "class":
      return CompletionItemKind.Class;
    case "function":
      return CompletionItemKind.Function;
    case "instance":
      return CompletionItemKind.Reference;
    case "keyword":
      return CompletionItemKind.Keyword;
    case "module":
      return CompletionItemKind.Module;
    case "param":
      return CompletionItemKind.Variable;
    case "path":
      return CompletionItemKind.File;
    case "property":
      return CompletionItemKind.Property;
    case "statement":
      return CompletionItemKind.Variable;
    default:
      return CompletionItemKind.Text;
  }
}

function getSortText(name: string, type: string): string {
  if (!name || name.startsWith("_")) {
    return `zz${name}`;
  }
  // Ref: https://github.com/whitphx/stlite/issues/1452
  if (type === "function" || type === "instance") {
    return `aa${name}`;
  }
  if (type === "param" && name.endsWith("=")) {
    return `bb${name}`;
  }
  return `cc${name}`;
}

/**
 * Provides code completion items for code editor.
 * This is the class that we need to implement so that the monaco can use it.
 * Copied from here
 * https://github.com/microsoft/monaco-editor/blob/main/src/language/common/lspLanguageFeatures.ts
 */
export class CodeCompletionProvider
  implements languages.CompletionItemProvider
{
  // Run this function when the period or open parenthesis is typed
  triggerCharacters = ["(", "[", ".", " ", "@", ",", '"'];

  constructor(private readonly callback: CodeCompletionCallback) {}

  async provideCompletionItems(model: editor.ITextModel, position: Position) {
    const result = await this.callback({
      code: model.getValue(),
      line: position.lineNumber,
      column: position.column - 1,
    });

    if (result && result.items.length) {
      const lastCharInLine = model.getLineMaxColumn(position.lineNumber);
      const valueInRightOfCursor = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: lastCharInLine,
      });
      const nextFirstNonPythonEntityIndex = valueInRightOfCursor.search(
        nonPythonEntityCharRegex,
      );

      return {
        suggestions: result.items.map(
          (item) =>
            ({
              label: item.name,
              insertText: item.name,
              detail: item.docstring,
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn:
                  nextFirstNonPythonEntityIndex === -1
                    ? lastCharInLine
                    : position.column + nextFirstNonPythonEntityIndex,
              },
              kind: getCompletionItemKind(item.type),
              sortText: getSortText(item.name, item.type),
            }) satisfies languages.CompletionItem,
        ),
      };
    }

    return { suggestions: [] };
  }
}
