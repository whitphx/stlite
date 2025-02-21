/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { languages } from "monaco-editor/esm/vs/editor/editor.api";
import { STLITE_SHARING_ORIGIN } from "../../constants";
import { StliteSharingIFrameRef } from "../../StliteSharingIFrame";

// import { STERAMLIT_ORIGIN } from '../../constants';
// import { AutocompleteRequestMessage, HoverRequestMessage } from '../types';

export type CodeCompletionRequestMessage = {
  code: string;
  currentLine: string;
  currentLineNumber: number;
  offset: number;
};

type StliteSharingResponseEvents = {
  "reply:language-server:code_completion": {
    items: languages.CompletionItem[];
  };
};

type StliteSharingRequestMessage = {
  "language-server:code_completion": {
    type: string;
    data: CodeCompletionRequestMessage;
  };
};

// Mapping of event type strings to their corresponding payload types
type EventPayloads = {
  [Type in keyof StliteSharingResponseEvents]: {
    type: Type;
    data: StliteSharingResponseEvents[Type];
  };
}[keyof StliteSharingResponseEvents];

// IMessage interface using the EventPayloads
type IMessage = EventPayloads;

export type StliteSharingResponseEvent = (
  payload: StliteSharingResponseEvents[keyof StliteSharingResponseEvents]
) => void;

export class StliteSharingCommunicationService {
  private streamlitOrigin = new URL(STLITE_SHARING_ORIGIN);
  private messageListeners: {
    [Type in keyof StliteSharingResponseEvents]?: StliteSharingResponseEvent[];
  } = {};

  constructor(
    private stliteSharingIframe: StliteSharingIFrameRef | null,
    private enableLogs = false
  ) {
    window.addEventListener("message", this.receiveMessage.bind(this), false);
  }

  async sendMessage(
    message: StliteSharingRequestMessage[keyof StliteSharingRequestMessage]
  ) {
    const response = await this.stliteSharingIframe?.postMessage(
      message as any
    );
    if (response) {
      this.handleMessage(response);
    }
  }

  on<Type extends keyof StliteSharingResponseEvents>(
    eventType: Type,
    callback: StliteSharingResponseEvent
  ): void {
    if (!this.messageListeners[eventType]) {
      this.messageListeners[eventType] = [];
    }
    this.messageListeners[eventType]?.push(callback);
  }

  off<Type extends keyof StliteSharingResponseEvents>(
    eventType: Type,
    callback: StliteSharingResponseEvent
  ): void {
    if (this.messageListeners[eventType]) {
      const index = this.messageListeners[eventType]?.findIndex(
        (item) => item === callback
      );

      if (index && index !== -1) {
        this.messageListeners[eventType]?.splice(index, 1);
      }
    }
  }

  private receiveMessage(event: MessageEvent) {
    if (event.origin !== this.streamlitOrigin.origin) {
      this.logMessage(
        "Received a message from an untrusted origin:",
        event.origin
      );
      return;
    }
    const message: IMessage = event.data;
    if (message && message.type && message.data) {
      this.logMessage("Received message:", message);
      this.handleMessage(message);
    }
  }

  /**
   * Broadcast/emmit the message to all subscribers/listeners
   * @param message
   */
  private handleMessage(message: IMessage) {
    const type = message.type as keyof StliteSharingResponseEvents;
    const handlers = this.messageListeners[type];
    if (handlers) {
      handlers.forEach((handler) => handler(message.data));
    } else {
      this.logMessage(
        `No handler registered for message type: ${message.type}`
      );
    }
  }

  close() {
    // first unsubscribe all listeners
    for (const key in this.messageListeners) {
      const eventName = key as keyof StliteSharingResponseEvents;
      while (this.messageListeners[eventName]!.length > 0) {
        this.messageListeners[eventName]!.pop();
      }
    }
    window.removeEventListener("message", this.receiveMessage);
  }

  private logMessage(message: any, ...optionalParams: any[]) {
    if (this.enableLogs) {
      console.log(message, optionalParams);
    }
  }
}
