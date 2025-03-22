import type { editor, Position, languages } from "monaco-editor";
import { CompletionItemInsertTextRule, CompletionItemKind } from "./types";
import type {
  CodeCompletionRequest,
  CodeCompletionResponse,
} from "@stlite/sharing-common/src/messages";

export type CodeCompletionCallback = (
  payload: CodeCompletionRequest,
) => Promise<CodeCompletionResponse>;

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
  triggerCharacters = [":", "[", "]", "@", "(", ",", '"', " ", "."];

  /**
   * Here is the list that comes from language-server-protocol (used in vscode)
   * we need to map it to monaco-editor CompletionItemKind as they differ
   * https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#completionItemKind
   */
  private completionKindMap = {
    1: CompletionItemKind.Text,
    2: CompletionItemKind.Method,
    3: CompletionItemKind.Function,
    4: CompletionItemKind.Constructor,
    5: CompletionItemKind.Field,
    6: CompletionItemKind.Variable,
    7: CompletionItemKind.Class,
    8: CompletionItemKind.Interface,
    9: CompletionItemKind.Module,
    10: CompletionItemKind.Property,
    11: CompletionItemKind.Unit,
    12: CompletionItemKind.Value,
    13: CompletionItemKind.Enum,
    14: CompletionItemKind.Keyword,
    15: CompletionItemKind.Snippet,
    16: CompletionItemKind.Color,
    17: CompletionItemKind.File,
    18: CompletionItemKind.Reference,
    19: CompletionItemKind.Folder,
    20: CompletionItemKind.EnumMember,
    21: CompletionItemKind.Constant,
    22: CompletionItemKind.Struct,
    23: CompletionItemKind.Event,
    24: CompletionItemKind.Operator,
    25: CompletionItemKind.TypeParameter,
  } as Record<languages.CompletionItemKind, CompletionItemKind>;

  constructor(private readonly callback: CodeCompletionCallback) {}

  async provideCompletionItems(
    model: editor.ITextModel,
    position: Position,
  ): Promise<languages.CompletionList> {
    const result = (await this.callback({
      code: model.getValue(),
      line: position.lineNumber,
      column: position.column - 1,
    })) as { items: languages.CompletionItem[] };

    if (result && result.items.length) {
      return {
        suggestions: result.items.map((item) => this.toCompletionItem(item)),
      };
    }

    return { suggestions: [] } as languages.CompletionList;
  }

  /**
   * The StreamLit autocomplete results are using the lsp types from vscode
   * They are slightly different with Monaco editor, especially for kind
   */
  private toCompletionItem = (
    entry: languages.CompletionItem,
  ): languages.CompletionItem => {
    const results = {
      label: entry.label,
      insertText: entry.insertText || entry.label,
      insertTextFormat: CompletionItemInsertTextRule.InsertAsSnippet,
      sortText: entry.sortText || entry.label,
      filterText: entry.filterText || entry.label,
      documentation: entry.documentation,
      detail: entry.detail,
      range: undefined, // monaco will handle this for you :)
      kind:
        this.completionKindMap[entry.kind] ??
        (entry.kind as CompletionItemKind),
    } as unknown as languages.CompletionItem;

    return results;
  };
}
