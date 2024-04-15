export enum LanguageServerEvents {
  autocomplete = "language-server:autocomplete",
  hover = "language-server:hover",
}

export interface OutMessageLangugeServerAutocomplete {
  type: LanguageServerEvents.autocomplete;
  data: {
    /**
     * Decided to use unknown to avoid importing whole package and bunch of stuff
     * from monaco-editor package that we don't need it here at all
     * https://microsoft.github.io/monaco-editor/typedoc/interfaces/languages.CompletionItem.html
     *
     */
    items: unknown[];
  };
}
export interface OutMessageLangugeServerHover {
  type: LanguageServerEvents.hover;
  data: string;
}
