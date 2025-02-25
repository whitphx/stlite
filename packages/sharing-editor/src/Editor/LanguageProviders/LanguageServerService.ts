import type { IDisposable } from "monaco-editor/esm/vs/editor/editor.api";

import type {
  LanguageServerCodeCompletionMessage,
  LanguageServerCodeCompletionRequestPayload,
  LanguageServerCodeCompletionResponse,
} from "@stlite/sharing-common";
import { postMessageToStliteSharing } from "../../stlite-sharing-communication";
import { STLITE_SHARING_IFRAME_ID } from "../../constants";

export class LanguageServerService implements IDisposable {
  dispose(): void {
    // cleanup resources
  }

  private getStliteSharingIframe(): HTMLIFrameElement {
    return document.getElementById(
      STLITE_SHARING_IFRAME_ID,
    ) as HTMLIFrameElement;
  }

  autocomplete(
    payload: LanguageServerCodeCompletionRequestPayload,
  ): Promise<LanguageServerCodeCompletionResponse> {
    const iframe = this.getStliteSharingIframe();
    const dto: LanguageServerCodeCompletionMessage = {
      type: "language-server:code_completion",
      data: payload,
    };
    return postMessageToStliteSharing(iframe, dto).then(
      (res) => res.data as LanguageServerCodeCompletionResponse,
    );
  }
}
