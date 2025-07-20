import type { editor, Position, languages } from "monaco-editor";
import { CompletionItemKind } from "./types";
import type {
  CodeCompletionRequest,
  CodeCompletionResponse,
} from "@stlite/sharing-common/src/messages";

const nonPythonEntityCharRegex = /[^a-zA-Z0-9_]/;

export type CodeCompletionFn = (
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
  if (type === "param" && name.endsWith("=")) {
    return `aa${name}`;
  }
  // Ref: https://github.com/whitphx/stlite/issues/1452
  if (type === "function" || type === "instance") {
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
  triggerCharacters = ["(", "[", ".", " ", "@", ",", '"'];

  constructor(private readonly codeCompletionFn: CodeCompletionFn) {}

  async provideCompletionItems(model: editor.ITextModel, position: Position) {
    const result = await this.codeCompletionFn({
      code: model.getValue(),
      line: position.lineNumber,
      column: position.column - 1,
    });

    if (result && result.items.length) {
      const lastColumnInLine = model.getLineMaxColumn(position.lineNumber);
      const valueInRightOfCursor = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: lastColumnInLine,
      });
      const nextNonEntityCharIndex = valueInRightOfCursor.search(
        nonPythonEntityCharRegex,
      );

      return {
        suggestions: result.items.map(
          (item) =>
            ({
              label: item.name,
              insertText: item.complete,
              detail: item.docstring,
              range: {
                startLineNumber: position.lineNumber,
                startColumn: position.column,
                endLineNumber: position.lineNumber,
                endColumn:
                  nextNonEntityCharIndex === -1
                    ? lastColumnInLine
                    : position.column + nextNonEntityCharIndex,
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
