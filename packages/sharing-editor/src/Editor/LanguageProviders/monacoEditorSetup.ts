import type { Monaco } from "@monaco-editor/react";
import type { IDisposable } from "monaco-editor/esm/vs/editor/editor.api";

import { CodeCompletionProvider } from "./CodeCompletitionProvider";
import { LanguageServerService } from "./LanguageServerService";

export const monacoEditorSetup = (monaco: Monaco) => {
  const disposables: IDisposable[] = [];
  const providers: IDisposable[] = [];

  const languageServerService = new LanguageServerService();

  // Provides autocomplete around where the current line is
  providers.push(
    monaco.languages.registerCompletionItemProvider(
      "python",
      new CodeCompletionProvider(languageServerService),
    ),
  );

  disposables.push(languageServerService);

  disposables.push(asDisposable(providers));

  // Monaco editor returns object with dispose method so it can clear out everything for us
  return asDisposable(disposables);
};

function asDisposable(disposables: IDisposable[]): IDisposable {
  return { dispose: () => disposeAll(disposables) };
}

function disposeAll(disposables: IDisposable[]) {
  while (disposables.length) {
    // eslint-disable-next-line
    disposables.pop()!.dispose();
  }
}
