import type { IDisposable } from "monaco-editor/esm/vs/editor/editor.api";

import type {
  LanguageServerCodeCompletionMessage,
  LanguageServerCodeCompletionRequestPayload,
  LanguageServerCodeCompletionResponse,
} from "@stlite/sharing-common";
import { postMessageToStliteSharing } from "../../stlite-sharing-communication";

export class LanguageServerService implements IDisposable {
  dispose(): void {
    // cleanup and resources
  }

  private getStliteSharingIframe(): HTMLIFrameElement {
    return document.querySelector(".preview-iframe") as HTMLIFrameElement;
  }
  autocomplete(
    payload: LanguageServerCodeCompletionRequestPayload,
  ): Promise<LanguageServerCodeCompletionResponse> {
    const iframe = this.getStliteSharingIframe();
    const dto: LanguageServerCodeCompletionMessage = {
      type: "language-server:code_completion",
      data: payload,
    };
    return postMessageToStliteSharing(iframe, dto, undefined, true).then(
      (res) => res.data as LanguageServerCodeCompletionResponse,
    );
  }
}
