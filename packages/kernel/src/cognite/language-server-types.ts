/**
 * https://jedi.readthedocs.io/en/latest/docs/api-classes.html#completion
 */
export type CompletionItem = {
  /** Name of variable/function/class/module. */
  name: string;
  /** The type of the definition. */
  type: string;
  /** A description of the Name object */
  description: string;
  /** Return a document string for this completion object. */
  docstring: string;
  /** Dot-separated path of this object. It is in the form of <module>[.<submodule>[...]][.<object>].  */
  full_name: string;
  /** Similar to name, but like name returns also the symbols, ex: param= */
  name_with_symbols: string;
  module_name: string;
};

export enum LanguageServerEvents {
  autocomplete = "language-server:autocomplete",
}

export interface OutMessageLangugeServerAutocomplete {
  type: LanguageServerEvents.autocomplete;
  data: {
    suggestions: CompletionItem[];
  };
}
