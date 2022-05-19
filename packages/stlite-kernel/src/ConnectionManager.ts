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
    return // TODO: Implement
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
