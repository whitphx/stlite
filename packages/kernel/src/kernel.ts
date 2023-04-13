// Ref: https://github.com/jupyterlite/jupyterlite/blob/f2ecc9cf7189cb19722bec2f0fc7ff5dfd233d47/packages/pyolite-kernel/src/kernel.ts

import { PromiseDelegate } from "@lumino/coreutils";

import { IAllowedMessageOriginsResponse } from "streamlit-browser/src/hocs/withHostCommunication/types";

import { makeAbsoluteWheelURL } from "./url";
import { CrossOriginWorkerMaker as Worker } from "./cross-origin-worker";

// Since v0.19.0, Pyodide raises an exception when importing not pure Python 3 wheels, whose path does not end with "py3-none-any.whl",
// so configuration on file-loader here is necessary so that the hash is not included in the bundled URL.
// About this change on Pyodide, see the links below:
// https://github.com/pyodide/pyodide/pull/1859
// https://pyodide.org/en/stable/project/changelog.html#micropip
import STLITE_SERVER_WHEEL from "!!file-loader?name=pypi/[name].[ext]&context=.!../py/stlite-server/dist/stlite_server-0.1.0-py3-none-any.whl"; // TODO: Extract the import statement to an auto-generated file like `_pypi.ts` in JupyterLite: https://github.com/jupyterlite/jupyterlite/blob/f2ecc9cf7189cb19722bec2f0fc7ff5dfd233d47/packages/pyolite-kernel/src/_pypi.ts
import STREAMLIT_WHEEL from "!!file-loader?name=pypi/[name].[ext]&context=.!../py/streamlit/lib/dist/streamlit-1.21.0-py2.py3-none-any.whl";

// Ref: https://github.com/streamlit/streamlit/blob/1.12.2/frontend/src/lib/UriUtil.ts#L32-L33
const FINAL_SLASH_RE = /\/+$/;
const INITIAL_SLASH_RE = /^\/+/;

export interface StliteKernelOptions {
  /**
   * The file path on the Pyodide File System (Emscripten FS) to be set as a target of the `run` command.
   */
  entrypoint: string;

  /**
   * A list of package names to be install at the booting-up phase.
   */
  requirements: string[];

  /**
   * Files to mount.
   */
  files: Record<
    string,
    { data: string | ArrayBufferView; opts?: Record<string, any> }
  >;

  /**
   * The URL of `pyodide.js` to be loaded via `importScripts()` in the worker.
   * If not specified, the default one is used.
   */
  pyodideEntrypointUrl?: string;

  /**
   *
   */
  wheelBaseUrl?: string;

  /**
   * If specified, the worker restores the site-packages directories from this archive file
   * and skip installing the wheels and required packages.
   */
  mountedSitePackagesSnapshotFilePath?: string;

  /**
   * This value will be passed to the withHostCommunication HOC so it verifies the origin of the messages from the parent window.
   * In the original Streamlit, this value is defined at https://github.com/streamlit/streamlit/blob/1.19.0/lib/streamlit/web/server/routes.py#L178-L194
   * and passed to the frontend via the `_stcore/allowed-message-origins` API endpoint.
   * Instead, in stlite, this value can be configured through this property,
   * while it is rarely necessary, as such iframe messaging is not used in stlite basically.
   * The primary usage is for the VSCode extension to use the iframe messaging to solve the problem of https://github.com/whitphx/stlite/issues/519
   * sending the `SET_PAGE_LINK_BASE_URL` message to the app in a WebView panel to override the URL scheme of the links.
   * Note that Streamlit's iframe messaging referred to here is different from the iframe messaging mechanism implemented for the iframe embedded on stlite sharing.
   */
  allowedOriginsResp?: IAllowedMessageOriginsResponse;

  /**
   * The `pathname` that will be used as both
   * a base path of the custom component URLs
   * ana the path of the main page in MPA.
   *
   * If not specified, the value of `window.location.pathname` at the time of the class initialization is used.
   * This default is good enough for most cases, however,
   * it may be a problem if the server is configured to return the main page even if the URL is pointing to the subpath.
   * In such a setting, problems like https://github.com/whitphx/stlite/issues/171 may happen,
   * so explicitly setting `basePath` is recommended.
   */
  basePath?: string;

  onProgress?: (message: string) => void;

  onLoad?: () => void;

  onError?: (error: Error) => void;
}

export class StliteKernel {
  private _isDisposed = false;

  private _worker: StliteWorker;

  private _loaded = new PromiseDelegate<void>();

  private _workerInitData: WorkerInitialData;

  public readonly basePath: string; // TODO: Move this prop to outside this class. This is not a member of the kernel business logic, but just a globally referred value.

  public readonly allowedOriginsResp: IAllowedMessageOriginsResponse; // Will be passed to ConnectionManager to call `setAllowedMessageOrigins` from it.

  private onProgress: StliteKernelOptions["onProgress"];

  private onLoad: StliteKernelOptions["onLoad"];

  private onError: StliteKernelOptions["onError"];

  constructor(options: StliteKernelOptions) {
    this.basePath = (options.basePath ?? window.location.pathname)
      .replace(FINAL_SLASH_RE, "")
      .replace(INITIAL_SLASH_RE, "");
    this.allowedOriginsResp = options.allowedOriginsResp ?? {
      allowedOrigins: [],
      useExternalAuthToken: false,
    };
    this.onProgress = options.onProgress;
    this.onLoad = options.onLoad;
    this.onError = options.onError;

    // HACK: Use `CrossOriginWorkerMaker` imported as `Worker` here.
    // Read the comment in `cross-origin-worker.ts` for the detail.
    const workerMaker = new Worker(new URL("./worker.js", import.meta.url));
    this._worker = workerMaker.worker;

    this._worker.onmessage = (e) => {
      this._processWorkerMessage(e.data);
    };

    let wheels: WorkerInitialData["wheels"] = undefined;
    if (options.mountedSitePackagesSnapshotFilePath == null) {
      console.debug("Custom wheel URLs:", {
        STLITE_SERVER_WHEEL,
        STREAMLIT_WHEEL,
      });
      const stliteServerWheelUrl = makeAbsoluteWheelURL(
        STLITE_SERVER_WHEEL as unknown as string,
        options.wheelBaseUrl
      );
      const streamlitWheelUrl = makeAbsoluteWheelURL(
        STREAMLIT_WHEEL as unknown as string,
        options.wheelBaseUrl
      );
      wheels = {
        stliteServer: stliteServerWheelUrl,
        streamlit: streamlitWheelUrl,
      };
      console.debug("Custom wheel resolved URLs:", wheels);
    }

    this._workerInitData = {
      entrypoint: options.entrypoint,
      files: options.files,
      requirements: options.requirements,
      pyodideEntrypointUrl: options.pyodideEntrypointUrl,
      wheels,
      mountedSitePackagesSnapshotFilePath:
        options.mountedSitePackagesSnapshotFilePath,
    };
  }

  get loaded(): Promise<void> {
    return this._loaded.promise;
  }

  public connectWebSocket(path: string): Promise<void> {
    return this._asyncPostMessage({
      type: "websocket:connect",
      data: {
        path,
      },
    });
  }

  public sendWebSocketMessage(payload: Uint8Array) {
    return this._asyncPostMessage({
      type: "websocket:send",
      data: {
        payload,
      },
    });
  }

  private handleWebSocketMessage:
    | ((payload: Uint8Array | string) => void)
    | null = null;
  public onWebSocketMessage(handler: (payload: Uint8Array | string) => void) {
    this.handleWebSocketMessage = handler;
  }

  public sendHttpRequest(request: HttpRequest): Promise<HttpResponse> {
    return this._asyncPostMessage(
      {
        type: "http:request",
        data: {
          request,
        },
      },
      "http:response"
    ).then((data) => {
      return data.response;
    });
  }

  public writeFile(
    path: string,
    data: string | ArrayBufferView,
    opts?: Record<string, any>
  ): Promise<void> {
    return this._asyncPostMessage({
      type: "file:write",
      data: {
        path,
        data,
        opts,
      },
    });
  }

  public renameFile(oldPath: string, newPath: string): Promise<void> {
    return this._asyncPostMessage({
      type: "file:rename",
      data: {
        oldPath,
        newPath,
      },
    });
  }

  public unlink(path: string): Promise<void> {
    return this._asyncPostMessage({
      type: "file:unlink",
      data: {
        path,
      },
    });
  }

  public install(requirements: string[]): Promise<void> {
    return this._asyncPostMessage({
      type: "install",
      data: {
        requirements,
      },
    });
  }

  private _asyncPostMessage(
    message: InMessage
  ): Promise<GeneralReplyMessage["data"]>;
  private _asyncPostMessage<T extends ReplyMessage["type"]>(
    message: InMessage,
    expectedReplyType: T
  ): Promise<Extract<ReplyMessage, { type: T }>["data"]>;
  private _asyncPostMessage(
    message: InMessage,
    expectedReplyType = "reply"
  ): Promise<ReplyMessage["data"]> {
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();

      channel.port1.onmessage = (e: MessageEvent<ReplyMessage>) => {
        channel.port1.close();
        const msg = e.data;
        if (msg.error) {
          reject(msg.error);
        } else {
          if (msg.type !== expectedReplyType) {
            throw new Error(`Unexpected reply type "${msg.type}"`);
          }
          resolve(msg.data);
        }
      };

      this._worker.postMessage(message, [channel.port2]);
    });
  }

  /**
   * Process a message coming from the pyodide web worker.
   *
   * @param msg The worker message to process.
   */
  private _processWorkerMessage(msg: OutMessage): void {
    switch (msg.type) {
      case "event:start": {
        this._worker.postMessage({
          type: "initData",
          data: this._workerInitData,
        });
        break;
      }
      case "event:progress": {
        this.onProgress && this.onProgress(msg.data.message);
        break;
      }
      case "event:error": {
        this.onError && this.onError(msg.data.error);
        break;
      }
      case "event:loaded": {
        this._loaded.resolve();
        this.onLoad && this.onLoad();
        break;
      }
      case "websocket:message": {
        const { payload } = msg.data;
        this.handleWebSocketMessage && this.handleWebSocketMessage(payload);
        break;
      }
    }
  }

  /**
   * Return whether the kernel is disposed.
   */
  get isDisposed(): boolean {
    return this._isDisposed;
  }

  /**
   * Dispose the kernel.
   */
  dispose(): void {
    if (this.isDisposed) {
      return;
    }
    this._worker.terminate();

    this._isDisposed = true;
  }
}
