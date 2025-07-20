import { describe, it, expect } from "vitest";
import { CodeCompletionProvider } from "./CodeCompletionProvider";
import type { editor, Position } from "monaco-editor";
import { CompletionItemKind } from "./types";

describe("CodeCompletionProvider", () => {
  const mockCodeCompleteFn = async () => ({
    items: [
      {
        name: "test_function",
        type: "function",
        docstring: "Test function docstring",
        complete: "st_function",
      },
      {
        name: "_private_var",
        type: "instance",
        docstring: "Private variable",
        complete: "rivate_var",
      },
      {
        name: "param=",
        type: "param",
        docstring: "Parameter",
        complete: "ram=",
      },
    ],
  });

  const mockModel = {
    getValue: () => "test code",
    getLineMaxColumn: () => 20,
    getValueInRange: () => "",
  } as unknown as editor.ITextModel;

  const mockPosition = {
    lineNumber: 1,
    column: 5,
  } as Position;

  it("should provide completion items with correct properties", async () => {
    const provider = new CodeCompletionProvider(mockCodeCompleteFn);
    const result = await provider.provideCompletionItems(
      mockModel,
      mockPosition,
    );

    expect(result.suggestions).toHaveLength(3);
    expect(result.suggestions[0]).toMatchObject({
      label: "test_function",
      insertText: "st_function",
      detail: "Test function docstring",
      kind: CompletionItemKind.Function,
      sortText: "bbtest_function",
    });
  });

  it("should handle empty completion results", async () => {
    const emptyCodeCompletionFn = async () => ({ items: [] });
    const provider = new CodeCompletionProvider(emptyCodeCompletionFn);
    const result = await provider.provideCompletionItems(
      mockModel,
      mockPosition,
    );

    expect(result.suggestions).toHaveLength(0);
  });

  it("should set correct sort text based on item type and name", async () => {
    const provider = new CodeCompletionProvider(mockCodeCompleteFn);
    const result = await provider.provideCompletionItems(
      mockModel,
      mockPosition,
    );

    expect(result.suggestions[0].sortText).toBe("bbtest_function"); // function
    expect(result.suggestions[1].sortText).toBe("zz_private_var"); // private instance
    expect(result.suggestions[2].sortText).toBe("aaparam="); // param with =
  });
});
