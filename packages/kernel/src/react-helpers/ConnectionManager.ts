/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2025)
 * Copyright (c) Yuichiro Tachibana (Tsuchiya) (2022-2025)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Stlite:
 * We customize ConnectionManager to connect to the stlite worker instead of the remote Streamlit server.
 * We are emulating WebSocket connection with minimal features needed for stlite,
 * so we omit `WebsocketConnection` for simplicity which is used in the original `ConnectionManager`
 * since the complex features it provides are not necessary for stlite's simplified WebSocket-like protocol.
 * In this stlite version, `ConnectionManager` directly handles the WebSocket-like communication with the stlite worker.
 */

import { getLogger } from "loglevel";

import { BackMsg, ForwardMsg } from "@streamlit/protobuf";

import { ConnectionState } from "@streamlit/connection";
import type { ConnectionManager as OriginalConnectionManager } from "@streamlit/connection";
import type { StliteKernel } from "../kernel";

const LOG = getLogger("ConnectionManager");

type OriginalProps = ConstructorParameters<typeof OriginalConnectionManager>[0];
type OriginalConnectionManagerPublicInterface = {
  [K in keyof OriginalConnectionManager]: OriginalConnectionManager[K];
};

interface Props extends OriginalProps {
  /**
   * Stlite: a stlite kernel object to connect to.
   */
  kernel: StliteKernel;
}

// Stlite: Copied from WebsocketConnection.tsx
interface MessageQueue {
  [index: number]: ForwardMsg;
}

/**
 * Manages our connection to the Server.
 */
export class ConnectionManager
  implements OriginalConnectionManagerPublicInterface
{
  private readonly props: Props;

  private connectionState: ConnectionState = ConnectionState.INITIAL;

  constructor(props: Props) {
    this.props = props;

    // This method returns a promise, but we don't care about its result.
    void this.connect();
  }

  /**
   * Indicates whether we're connected to the server.
   */
  public isConnected(): boolean {
    return this.connectionState === ConnectionState.CONNECTED;
  }

  /**
   * Return the BaseUriParts for the server we're connected to,
   * if we are connected to a server.
   */
  public getBaseUriParts(): URL | undefined {
    if (this.connectionState === ConnectionState.CONNECTED) {
      // Stlite:
      // This method became necessary for multi-page apps: https://github.com/streamlit/streamlit/pull/4698/files#diff-e56cb91573ddb6a97ecd071925fe26504bb5a65f921dc64c63e534162950e1ebR967-R975
      // so here a dummy BaseUriParts object is returned.
      // The hostname is a dummy value so that the URL is invalid,
      // in order to avoid unexpected accesses to external resources,
      // while the pathname is representing the actual info.
      const url = new URL("https://stlite.invalid/"); // .invalid is a special domain that is not routable. Ref: https://www.rfc-editor.org/rfc/rfc2606.html

      // When a new session starts, a page name for multi-page apps (a relative path to the app root url) is calculated based on this `basePath`
      // then a `rerunScript` BackMsg is sent to the server with `pageName` (https://github.com/streamlit/streamlit/blob/ace58bfa3582d4f8e7f281b4dbd266ddd8a32b54/frontend/src/App.tsx#L1064)
      // and `window.history.pushState` is called (https://github.com/streamlit/streamlit/blob/ace58bfa3582d4f8e7f281b4dbd266ddd8a32b54/frontend/src/App.tsx#L665).
      url.pathname = this.props.kernel.basePath;

      return url;
    }
    return undefined;
  }

  public sendMessage(obj: BackMsg): void {
    // Stlite: we call `kernel.sendWebSocketMessage` directly here instead of using `WebsocketConnection`.
    if (this.isConnected()) {
      const msg = BackMsg.create(obj);
      const buffer = BackMsg.encode(msg).finish();
      this.props.kernel.sendWebSocketMessage(buffer);
    } else {
      // Don't need to make a big deal out of this. Just print to console.

      LOG.error(`Cannot send message when server is disconnected: ${obj}`);
    }
  }

  /**
   * Increment the runCount on our message cache, and clear entries
   * whose age is greater than the max.
   */
  public incrementMessageCacheRunCount(
    _maxMessageAge: number,
    _fragmentIdsThisRun: string[],
  ): void {
    // Stlite: no-op.
    // Caching is disabled in stlite. See https://github.com/whitphx/stlite/issues/495
  }

  public getCachedMessageHashes(): string[] {
    // Stlite: Doesn't handle caches.
    return [];
  }

  /**
   * Establish either a WebsocketConnection or StaticConnection
   * based on query params.
   */
  private async connect(): Promise<void> {
    // Stlite: we connect to the stlite worker by calling `kernel.connectWebSocket` directly here instead of using `WebsocketConnection`.
    const WEBSOCKET_STREAM_PATH = "_stcore/stream"; // The original is defined in streamlit/frontend/src/lib/WebsocketConnection.tsx

    // Establish a websocket connection
    try {
      this.props.kernel.onWebSocketMessage((payload) => {
        if (typeof payload === "string") {
          LOG.error("Unexpected payload type.");
          return;
        }
        this.handleMessage(payload);
      });

      await this.props.kernel.loaded;
      console.debug("The kernel has been loaded. Start connecting.");
      this.props.onHostConfigResp(this.props.kernel.hostConfigResponse);

      await this.props.kernel.connectWebSocket("/" + WEBSOCKET_STREAM_PATH);
      this.setConnectionState(ConnectionState.CONNECTED);
    } catch (e) {
      const err = e instanceof Error ? e : new Error(`${e}`);
      LOG.error(`Client Error: Websocket connection - ${err.message}`);
      this.props.sendClientError(
        "Failed to establish websocket connection",
        err.message,
        "Connection Manager",
      );
      this.setConnectionState(
        ConnectionState.DISCONNECTED_FOREVER,
        err.message,
      );
    }
  }

  disconnect(): void {
    // Stlite: no-op.
    // We don't need to consider disconnection in stlite because it's not a remote connection.
  }

  private setConnectionState = (
    connectionState: ConnectionState,
    errMsg?: string,
  ): void => {
    if (this.connectionState !== connectionState) {
      this.connectionState = connectionState;
      this.props.connectionStateChanged(connectionState);
    }

    if (errMsg) {
      this.props.onConnectionError(errMsg);
    }
  };

  // Stlite: the following properties and methods are copied from WebsocketConnection.tsx

  /**
   * To guarantee packet transmission order, this is the index of the last
   * dispatched incoming message.
   */
  private lastDispatchedMessageIndex = -1;

  /**
   * And this is the index of the next message we receive.
   */
  private nextMessageIndex = 0;

  /**
   * This dictionary stores received messages that we haven't sent out yet
   * (because we're still decoding previous messages)
   */
  private readonly messageQueue: MessageQueue = {};

  private async handleMessage(data: ArrayBuffer): Promise<void> {
    // Assign this message an index.
    const messageIndex = this.nextMessageIndex;
    this.nextMessageIndex += 1;

    const encodedMsg = new Uint8Array(data);
    const msg = ForwardMsg.decode(encodedMsg);

    // Stlite: doesn't handle caches.
    if (msg.type === "refHash") {
      throw new Error(`Unexpected cache reference message.`);
    }

    this.messageQueue[messageIndex] = msg;

    // Dispatch any pending messages in the queue. This may *not* result
    // in our just-decoded message being dispatched: if there are other
    // messages that were received earlier than this one but are being
    // downloaded, our message won't be sent until they're done.
    while (this.lastDispatchedMessageIndex + 1 in this.messageQueue) {
      const dispatchMessageIndex = this.lastDispatchedMessageIndex + 1;
      this.props.onMessage(this.messageQueue[dispatchMessageIndex]);
      delete this.messageQueue[dispatchMessageIndex];
      this.lastDispatchedMessageIndex = dispatchMessageIndex;
    }
  }
}
