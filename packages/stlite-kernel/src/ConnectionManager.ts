// Mimic https://github.com/streamlit/streamlit/blob/1.9.0/frontend/src/lib/ConnectionManager.ts

import { BackMsg, ForwardMsg } from "streamlit-browser/src/autogen/proto"
import { ReactNode } from "react"

import { StliteKernel } from "./kernel"
import { ConnectionState } from "./ConnectionState"
import { ensureError } from "./ErrorHandling"

// import { BaseUriParts } from "streamlit-browser/src/lib/UriUtil"
/**
 * host:port tuple
 */
export interface BaseUriParts {
  host: string
  port: number
  basePath: string
}

interface Props {
  /**
   * Kernel object to connect to.
   */
  kernel: StliteKernel;

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
}

export class ConnectionManager {
  private readonly props: Props

  private connectionState: ConnectionState = ConnectionState.INITIAL

  constructor(props: Props) {
    this.props = props

    this.props.kernel.onWebSocketMessage((payload) => {
      if (typeof payload === "string") {
        console.error("Unexpected payload type.")
        return;
      }
      props.onMessage(ForwardMsg.decode(payload))
    })

    this.props.kernel.loaded.then(() => {
      console.log("The kernel has been loaded. Start connecting.")
      this.connect();
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
      // so here a dummy BaseUriParts object is returned though it may not be compatible with multi-page functionality.
      // For multi-page app compatibility,
      // See https://github.com/streamlit/streamlit/blob/ace58bfa3582d4f8e7f281b4dbd266ddd8a32b54/frontend/src/lib/UriUtil.ts#L60-L72
      // or its caller https://github.com/streamlit/streamlit/blob/ace58bfa3582d4f8e7f281b4dbd266ddd8a32b54/frontend/src/lib/ConnectionManager.ts#L142
      return {
        host: "xxx",
        port: 99999,
        // When a new session starts, a page name for multi-page apps (a relative path to the app root url) is calculated based on this `basePath`
        // then a `rerunScript` BackMsg is sent to the server with `pageName` (https://github.com/streamlit/streamlit/blob/ace58bfa3582d4f8e7f281b4dbd266ddd8a32b54/frontend/src/App.tsx#L1064)
        // and `window.history.pushState` is called (https://github.com/streamlit/streamlit/blob/ace58bfa3582d4f8e7f281b4dbd266ddd8a32b54/frontend/src/App.tsx#L665),
        // so here `window.location.pathname` must be set here as `basePath` representing the app root url path.
        // With this implementation, multi-page apps are not supported on stlite.
        // See https://github.com/whitphx/stlite/issues/41
        basePath: (window.location.pathname || "").replace(/^\//, "")
      }
    }
    return undefined
  }

  public sendMessage(obj: BackMsg): void {
    if (this.isConnected()) {
      this.props.kernel.sendWebSocketMessage(BackMsg.encode(BackMsg.create(obj)).finish())
    } else {
      // Don't need to make a big deal out of this. Just print to console.
      console.error(`Cannot send message when server is disconnected: ${obj}`)
    }
  }

  /**
   * Increment the runCount on our message cache, and clear entries
   * whose age is greater than the max.
   */
  public incrementMessageCacheRunCount(maxMessageAge: number): void {
    // TODO: Implement
  }

  private async connect(): Promise<void> {
    const WEBSOCKET_STREAM_PATH = "stream"  // The original is defined in streamlit/frontend/src/lib/WebsocketConnection.tsx

    try {
      await this.props.kernel.connectWebSocket(WEBSOCKET_STREAM_PATH)
      this.setConnectionState(ConnectionState.CONNECTED)
    } catch (e) {
      const err = ensureError(e);
      console.error(err.message)
      this.setConnectionState(
        ConnectionState.DISCONNECTED_FOREVER,
        err.message
      )
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
