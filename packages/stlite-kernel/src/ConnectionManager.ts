// Mimic https://github.com/streamlit/streamlit/blob/1.9.0/frontend/src/lib/ConnectionManager.ts

import { BackMsg, ForwardMsg } from "streamlit-browser/src/autogen/proto"
import { BaseUriParts } from "streamlit-browser/src/lib/UriUtil"
import { ReactNode } from "react"

import { ConnectionState } from "streamlit-browser/src/lib/ConnectionState"

interface Props {
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
  constructor(props: Props) {
  }

  /**
   * Indicates whether we're connected to the server.
   */
  public isConnected(): boolean {
  }

  /**
   * Return the BaseUriParts for the server we're connected to,
   * if we are connected to a server.
   */
  public getBaseUriParts(): BaseUriParts | undefined {
  }

  public sendMessage(obj: BackMsg): void {
  }

  /**
   * Increment the runCount on our message cache, and clear entries
   * whose age is greater than the max.
   */
  public incrementMessageCacheRunCount(maxMessageAge: number): void {
  }

}
