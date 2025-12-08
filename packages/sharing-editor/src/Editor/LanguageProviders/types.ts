/**
 * The types below are exact copy from monaco-editor.
 * The reason why we are not importing from there is
 * that at the moment you import something that is
 * not a type/interface, it will pull the whole
 * monaco-editor code in your final bundle.
 *
 */
// https://microsoft.github.io/monaco-editor/typedoc/enums/languages.CompletionItemKind.html
export enum CompletionItemKind {
  Method = 0,
  Function = 1,
  Constructor = 2,
  Field = 3,
  Variable = 4,
  Class = 5,
  Struct = 6,
  Interface = 7,
  Module = 8,
  Property = 9,
  Event = 10,
  Operator = 11,
  Unit = 12,
  Value = 13,
  Constant = 14,
  Enum = 15,
  EnumMember = 16,
  Keyword = 17,
  Text = 18,
  Color = 19,
  File = 20,
  Reference = 21,
  Customcolor = 22,
  Folder = 23,
  TypeParameter = 24,
  User = 25,
  Issue = 26,
  Tool = 27,
  Snippet = 28,
}
