// Mimic https://github.com/streamlit/streamlit/blob/1.9.0/frontend/src/lib/ConnectionManager.ts
// and WebsocketConnection.

import { BackMsg, ForwardMsg } from "streamlit-browser/src/autogen/proto"
import { IAllowedMessageOriginsResponse } from "streamlit-browser/src/hocs/withHostCommunication/types"
import { BaseUriParts } from "streamlit-browser/src/lib/UriUtil"
import { ReactNode } from "react"

import { StliteKernel } from "../../kernel"
import { ConnectionState } from "streamlit-browser/src/lib/ConnectionState"
import { SessionInfo } from "streamlit-browser/src/lib/SessionInfo"
import { ensureError } from "streamlit-browser/src/lib/ErrorHandling"
import { DUMMY_BASE_HOSTNAME, DUMMY_BASE_PORT } from "../../consts"

interface MessageQueue {
  [index: number]: any
}

interface Props {
  /**
   * Kernel object to connect to.
   */
  kernel: StliteKernel

  /** The app's SessionInfo instance */
  sessionInfo: SessionInfo

  /**
   * Function to be called when we receive a message from the server.
   */
  onMessage: (message: ForwardMsg) => void

  /**
   * Function to be called when the connection errors out.
   */
  onConnectionError: (errNode: ReactNode) => void

  /**
   * Called when our ConnectionState is changed.
   */
  connectionStateChanged: (connectionState: ConnectionState) => void

  /**
   * Function to set the list of origins that this app should accept
   * cross-origin messages from (if in a relevant deployment scenario).
   */
  setAllowedOriginsResp: (resp: IAllowedMessageOriginsResponse) => void
}

export class ConnectionManager {
  private readonly props: Props

  private connectionState: ConnectionState = ConnectionState.INITIAL

  constructor(props: Props) {
    this.props = props

    this.props.kernel.onWebSocketMessage((payload) => {
      if (typeof payload === "string") {
        console.error("Unexpected payload type.")
        return
      }
      this.handleMessage(payload)
    })

    this.props.kernel.loaded.then(() => {
      console.log("The kernel has been loaded. Start connecting.")
      this.props.setAllowedOriginsResp(this.props.kernel.allowedOriginsResp)
      this.connect()
    })
  }

  /**
   * Indicates whether we're connected to the server.
   */
  public isConnected(): boolean {
    return this.connectionState === ConnectionState.CONNECTED
  }

  /**
   * Return the BaseUriParts for the server we're connected to,
   * if we are connected to a server.
   */
  public getBaseUriParts(): BaseUriParts | undefined {
    if (this.connectionState === ConnectionState.CONNECTED) {
      // The existence of this property became necessary for multi-page apps: https://github.com/streamlit/streamlit/pull/4698/files#diff-e56cb91573ddb6a97ecd071925fe26504bb5a65f921dc64c63e534162950e1ebR967-R975
      // so here a dummy BaseUriParts object is returned.
      // The host and port are set as dummy values that are invalid as a URL
      // in order to avoid unexpected accesses to external resources,
      // while the basePath is representing the actual info.
      return {
        host: DUMMY_BASE_HOSTNAME,
        port: DUMMY_BASE_PORT,
        // When a new session starts, a page name for multi-page apps (a relative path to the app root url) is calculated based on this `basePath`
        // then a `rerunScript` BackMsg is sent to the server with `pageName` (https://github.com/streamlit/streamlit/blob/ace58bfa3582d4f8e7f281b4dbd266ddd8a32b54/frontend/src/App.tsx#L1064)
        // and `window.history.pushState` is called (https://github.com/streamlit/streamlit/blob/ace58bfa3582d4f8e7f281b4dbd266ddd8a32b54/frontend/src/App.tsx#L665).
        basePath: this.props.kernel.basePath,
      }
    }
    return undefined
  }

  public sendMessage(obj: BackMsg): void {
    if (this.isConnected()) {
      this.props.kernel.sendWebSocketMessage(
        BackMsg.encode(BackMsg.create(obj)).finish()
      )
    } else {
      // Don't need to make a big deal out of this. Just print to console.
      console.error(`Cannot send message when server is disconnected: ${obj}`)
    }
  }

  /**
   * To guarantee packet transmission order, this is the index of the last
   * dispatched incoming message.
   */
  private lastDispatchedMessageIndex = -1

  /**
   * And this is the index of the next message we receive.
   */
  private nextMessageIndex = 0

  /**
   * This dictionary stores received messages that we haven't sent out yet
   * (because we're still decoding previous messages)
   */
  private readonly messageQueue: MessageQueue = {}

  /**
   * No-op in stlite.
   */
  public incrementMessageCacheRunCount(): void {
    // no-op.
    // Because caching is disabled in stlite. See https://github.com/whitphx/stlite/issues/495
  }

  private async handleMessage(data: ArrayBuffer): Promise<void> {
    // Assign this message an index.
    const messageIndex = this.nextMessageIndex
    this.nextMessageIndex += 1

    const encodedMsg = new Uint8Array(data)
    const msg = ForwardMsg.decode(encodedMsg)

    // stlite doesn't handle caches.
    if (msg.type === "refHash") {
      throw new Error(`Unexpected cache reference message.`)
    }

    this.messageQueue[messageIndex] = msg

    // Dispatch any pending messages in the queue. This may *not* result
    // in our just-decoded message being dispatched: if there are other
    // messages that were received earlier than this one but are being
    // downloaded, our message won't be sent until they're done.
    while (this.lastDispatchedMessageIndex + 1 in this.messageQueue) {
      const dispatchMessageIndex = this.lastDispatchedMessageIndex + 1
      this.props.onMessage(this.messageQueue[dispatchMessageIndex])
      delete this.messageQueue[dispatchMessageIndex]
      this.lastDispatchedMessageIndex = dispatchMessageIndex
    }
  }

  private async connect(): Promise<void> {
    const WEBSOCKET_STREAM_PATH = "_stcore/stream" // The original is defined in streamlit/frontend/src/lib/WebsocketConnection.tsx

    try {
      await this.props.kernel.connectWebSocket("/" + WEBSOCKET_STREAM_PATH)
      this.setConnectionState(ConnectionState.CONNECTED)
    } catch (e) {
      const err = ensureError(e)
      console.error(err.message)
      this.setConnectionState(ConnectionState.DISCONNECTED_FOREVER, err.message)
    }
  }

  private setConnectionState = (
    connectionState: ConnectionState,
    errMsg?: string
  ): void => {
    if (this.connectionState !== connectionState) {
      this.connectionState = connectionState
      this.props.connectionStateChanged(connectionState)
    }

    if (errMsg || connectionState === ConnectionState.DISCONNECTED_FOREVER) {
      this.props.onConnectionError(errMsg || "unknown")
    }
  }
}
