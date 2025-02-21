import type {
  IDisposable,
  languages,
} from "monaco-editor/esm/vs/editor/editor.api";

import {
  CodeCompletionRequestMessage,
  StliteSharingCommunicationService,
  StliteSharingResponseEvent,
} from "./StliteSharingCommunicationService";
import { StliteSharingIFrameRef } from "../../StliteSharingIFrame";

export class LanguageServerService implements IDisposable {
  private sharingAppCommunicationService: StliteSharingCommunicationService;
  constructor(private stliteSharingIframe: StliteSharingIFrameRef | null) {
    this.sharingAppCommunicationService = new StliteSharingCommunicationService(
      stliteSharingIframe
    );
  }

  dispose(): void {
    this.sharingAppCommunicationService.close();
  }

  autocomplete(
    payload: CodeCompletionRequestMessage
  ): Promise<{ items: languages.CompletionItem[] }> {
    return new Promise((resolve, _reject) => {
      const handleAutoComplete = (data: {
        items: languages.CompletionItem[];
      }) => {
        this.sharingAppCommunicationService.off(
          "reply:language-server:code_completion",
          handleAutoComplete as StliteSharingResponseEvent
        );
        resolve(data);
      };

      this.sharingAppCommunicationService.on(
        "reply:language-server:code_completion",
        handleAutoComplete as StliteSharingResponseEvent
      );

      this.sharingAppCommunicationService.sendMessage({
        type: "language-server:code_completion",
        data: payload,
      });
    });
  }
}
