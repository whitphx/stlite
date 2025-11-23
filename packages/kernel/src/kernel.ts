// Ref: https://github.com/jupyterlite/jupyterlite/blob/f2ecc9cf7189cb19722bec2f0fc7ff5dfd233d47/packages/pyolite-kernel/src/kernel.ts

import type { PackageData } from "pyodide";
import { PromiseDelegate } from "@stlite/common";
import type { IHostConfigResponse } from "@streamlit/connection/src/types";
import { CrossOriginWorkerMaker as Worker } from "./cross-origin-worker";
import type {
  EmscriptenFile,
  EmscriptenFileUrl,
  ReplyMessageGeneralReply,
  HttpRequest,
  HttpResponse,
  InMessage,
  OutMessage,
  PyodideArchive,
  PyodideArchiveUrl,
  ReplyMessage,
  StliteWorker,
  StliteMessagePort,
  WorkerInitialData,
  StreamlitConfig,
  ModuleAutoLoadMessage,
  CodeCompletion,
  MicropipInstallOptions,
} from "./types";
import { assertStreamlitConfig } from "./types";

// Ref: https://github.com/streamlit/streamlit/blob/1.12.2/frontend/src/lib/UriUtil.ts#L32-L33
const FINAL_SLASH_RE = /\/+$/;
const INITIAL_SLASH_RE = /^\/+/;

const validateEnvKey = (key: string) => {
  // Validate each variable name: it must start with a letter or underscore,
  // and can contain only letters, digits, or underscores.
  const validEnvNameRegex = /^[A-Za-z_][A-Za-z0-9_]*$/;
  return validEnvNameRegex.test(key);
};

function isSharedWorker(
  worker: StliteWorker | SharedWorker,
): worker is SharedWorker {
  // `SharedWorker` is not available in some environments like Chrome for Android,
  // so we need to check if it is available before using it.
  return (
    typeof window.SharedWorker !== "undefined" && worker instanceof SharedWorker
  );
}

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
   * A list of prebuilt package names to be install at the booting-up phase via `pyodide.loadPackage()`.
   * These packages basically can be installed via the `requirements` option,
   * but some are only installable via this option such as `openssl`.
   */
  prebuiltPackageNames: string[];

  /**
   * Files to mount.
   */
  files: Record<string, EmscriptenFile | EmscriptenFileUrl>;

  /**
   * Archives to unpack and mount.
   */
  archives: Array<PyodideArchive | PyodideArchiveUrl>;

  /**
   * Additional packages to install.
   * The packages specified in `requirements` will be installed in the same call of `micropip.install()`
   * as some built-in dependencies such as `streamlit` and `stlite-lib` with the fixed options.
   * This `installs` option is used to install packages with more flexible options
   */
  installs?: WorkerInitialData["installs"];

  /**
   * The URL of `pyodide.js` or `pyodide.mjs` to be loaded in the worker.
   * If not specified, the default one is used.
   */
  pyodideUrl?: string;

  wheelUrls?: {
    stliteLib: string;
    streamlit: string;
  };

  /**
   * In the original Streamlit, the `hostConfig` endpoint returns a value of this type
   * and the frontend app fetches it (https://github.com/streamlit/streamlit/blob/1.30.0/frontend/app/src/connection/WebsocketConnection.tsx#L696-L703)
   * and passes it to the `onHostConfigResp` callback to configure the app (https://github.com/streamlit/streamlit/blob/1.30.0/frontend/app/src/App.tsx#L393-L415).
   * Instead, in stlite, this value can be configured through this property,
   * which is passed to the `ConnectionManager` class to call `onHostConfigResp` from it.
   * One of the usages in stlite is to configure the `allowedOrigins` property
   * for VSCode extension to use the iframe messaging to solve the problem of https://github.com/whitphx/stlite/issues/519
   * by sending the `SET_PAGE_LINK_BASE_URL` message to the app in a WebView panel to override the URL scheme of the links.
   * Note that Streamlit's iframe messaging referred to here is different from the iframe messaging mechanism implemented for the iframe embedded on stlite sharing.
   */
  hostConfigResponse?: IHostConfigResponse;

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

  /**
   * Streamlit configurations described in https://docs.streamlit.io/library/advanced-features/configuration.
   * These values can be configured through this property as key-value pairs.
   * The keys are the same as the ones passed to the `streamlit run` shell command as `--` options (flags).
   * For example, `--logger.level info` is passed as `{ "logger.level": "info" }`.
   */
  streamlitConfig?: StreamlitConfig;

  idbfsMountpoints?: WorkerInitialData["idbfsMountpoints"];

  moduleAutoLoad?: WorkerInitialData["moduleAutoLoad"];

  workerType?: WorkerOptions["type"];

  sharedWorker?: boolean;

  env?: Record<string, string>;

  /**
   * Set to true to enable the Python code completion feature and make `getCodeCompletion` available.
   * It loads some additional Python packages to support the feature.
   */
  languageServer?: boolean;

  /**
   * The worker to be used, which can be optionally passed.
   * Desktop apps with NodeJS-backed worker is one use case.
   */
  worker?: globalThis.Worker;
}

export interface StliteKernelEventMap {
  loadProgress: CustomEvent<string>;
  loadFinished: Event;
  loadError: CustomEvent<Error>;
  install: CustomEvent<{
    requirements: string[];
    promise: Promise<void>;
  }>;
  writeFile: CustomEvent<{
    path: string;
    promise: Promise<void>;
  }>;
  renameFile: CustomEvent<{
    oldPath: string;
    newPath: string;
    promise: Promise<void>;
  }>;
  unlink: CustomEvent<{
    path: string;
    promise: Promise<void>;
  }>;
  readFile: CustomEvent<{
    path: string;
    promise: Promise<Uint8Array>;
  }>;
  reboot: CustomEvent<{
    entrypoint: string;
    promise: Promise<void>;
  }>;
  moduleAutoLoad: CustomEvent<{
    packagesToLoad: string[];
    promise: Promise<PackageData[]>;
  }>;
}
export type StliteKernelEventListener<K extends keyof StliteKernelEventMap> = (
  ev: StliteKernelEventMap[K],
) => void;
export type StliteKernelEventHandlerObject<
  K extends keyof StliteKernelEventMap,
> = {
  handleEvent(object: StliteKernelEventMap[K]): void;
};
export type StliteKernelEventListenerOrEventListenerObject<
  K extends keyof StliteKernelEventMap,
> = StliteKernelEventListener<K> | StliteKernelEventHandlerObject<K>;

export class StliteKernel extends EventTarget {
  private _isDisposed = false;

  private _worker: StliteWorker | SharedWorker;
  private _postMessageTarget: StliteWorker | StliteMessagePort;

  private _loaded = new PromiseDelegate<void>();

  private _workerInitData: WorkerInitialData;

  public readonly basePath: string; // TODO: Move this prop to outside this class. This is not a member of the kernel business logic, but just a globally referred value.

  public readonly hostConfigResponse: IHostConfigResponse; // Will be passed to ConnectionManager to call `onHostConfigResp` from it.

  addEventListener<K extends keyof StliteKernelEventMap>(
    type: K,
    listener: StliteKernelEventListenerOrEventListenerObject<K>,
    options?: boolean | AddEventListenerOptions,
  ): void {
    super.addEventListener(
      type,
      listener as EventListenerOrEventListenerObject,
      options,
    );
  }
  removeEventListener<K extends keyof StliteKernelEventMap>(
    type: K,
    listener: StliteKernelEventListenerOrEventListenerObject<K>,
    options?: boolean | EventListenerOptions,
  ): void {
    super.removeEventListener(
      type,
      listener as EventListenerOrEventListenerObject,
      options,
    );
  }
  dispatchEvent(
    event: StliteKernelEventMap[keyof StliteKernelEventMap],
  ): boolean {
    return super.dispatchEvent(event);
  }

  constructor(options: StliteKernelOptions) {
    super();

    this.basePath = (options.basePath ?? window.location.pathname)
      .replace(FINAL_SLASH_RE, "")
      .replace(INITIAL_SLASH_RE, "");
    this.hostConfigResponse = options.hostConfigResponse ?? {};

    if (options.worker) {
      this._worker = options.worker;
    } else {
      // HACK: Use `CrossOriginWorkerMaker` imported as `Worker` here.
      // Read the comment in `cross-origin-worker.ts` for the detail.
      const workerMaker = new Worker(new URL("./worker.js", import.meta.url), {
        /* @vite-ignore */ // To avoid the Vite error: "[vite:worker-import-meta-url] Vite is unable to parse the worker options as the value is not static.To ignore this error, please use /* @vite-ignore */ in the worker options."
        type: options.workerType,
        shared: options.sharedWorker ?? false,
      });
      this._worker = workerMaker.worker;
    }

    if (isSharedWorker(this._worker)) {
      this._worker.port.start();
      this._postMessageTarget = this._worker.port;
    } else {
      this._postMessageTarget = this._worker;
    }
    this._postMessageTarget.onmessage = (e: MessageEvent<OutMessage>) => {
      this._processWorkerMessage(e.data, e.ports[0]);
    };

    // TODO: Assert other options as well.
    if (options.streamlitConfig != null) {
      assertStreamlitConfig(options.streamlitConfig);
    }

    this._workerInitData = {
      entrypoint: options.entrypoint,
      files: options.files,
      archives: options.archives,
      requirements: options.requirements,
      prebuiltPackageNames: options.prebuiltPackageNames,
      pyodideUrl: options.pyodideUrl,
      wheels: options.wheelUrls,
      streamlitConfig: options.streamlitConfig,
      idbfsMountpoints: options.idbfsMountpoints,
      moduleAutoLoad: options.moduleAutoLoad ?? false,
      env: options.env,
      languageServer: options.languageServer ?? false,
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
    }).then();
  }

  public sendWebSocketMessage(payload: Uint8Array): Promise<void> {
    return this._asyncPostMessage({
      type: "websocket:send",
      data: {
        payload,
      },
    }).then();
  }

  private handleWebSocketMessage:
    | ((payload: ArrayBuffer | string) => void)
    | null = null;
  public onWebSocketMessage(handler: (payload: ArrayBuffer | string) => void) {
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
      "http:response",
    ).then((data) => {
      return {
        ...data.response,
        headers: new Headers(Object.fromEntries(data.response.headers)),
      };
    });
  }

  public writeFile(
    path: string,
    data: string | ArrayBufferView,
    opts?: Record<string, unknown>,
  ): Promise<void> {
    const promise = this._asyncPostMessage({
      type: "file:write",
      data: {
        path,
        data,
        opts,
      },
    }).then(() => {});

    this.dispatchEvent(
      new CustomEvent("writeFile", {
        detail: {
          path,
          promise,
        },
      }),
    );

    return promise;
  }

  public renameFile(oldPath: string, newPath: string): Promise<void> {
    const promise = this._asyncPostMessage({
      type: "file:rename",
      data: {
        oldPath,
        newPath,
      },
    }).then(() => {});

    this.dispatchEvent(
      new CustomEvent("renameFile", {
        detail: {
          oldPath,
          newPath,
          promise,
        },
      }),
    );

    return promise;
  }

  public readFile(
    path: string,
    opts?: Record<string, unknown>,
  ): Promise<string | Uint8Array> {
    const promise = this._asyncPostMessage(
      {
        type: "file:read",
        data: {
          path,
          opts,
        },
      },
      "reply:file:read",
    ).then((data) => data.content);

    this.dispatchEvent(
      new CustomEvent("readFile", {
        detail: {
          path,
          promise,
        },
      }),
    );

    return promise;
  }

  public unlink(path: string): Promise<void> {
    return this._asyncPostMessage({
      type: "file:unlink",
      data: {
        path,
      },
    }).then();
  }

  public install(
    requirements: string[],
    options?: MicropipInstallOptions,
  ): Promise<void> {
    const promise = this._asyncPostMessage({
      type: "install",
      data: {
        requirements,
        options,
      },
    }).then<void>(() => {});

    this.dispatchEvent(
      new CustomEvent("install", {
        detail: {
          requirements,
          promise,
        },
      }),
    );

    return promise;
  }

  public setEnv(env: Record<string, string>): Promise<void> {
    Object.keys(env).forEach((key) => {
      if (!validateEnvKey(key)) {
        throw new Error(`Invalid environment variable name: "${key}"`);
      }
    });

    return this._asyncPostMessage({
      type: "setEnv",
      data: {
        env,
      },
    }).then();
  }

  public getCodeCompletion(
    code: string,
    position: {
      line: number;
      column: number;
    },
  ): Promise<CodeCompletion[]> {
    if (!this._workerInitData.languageServer) {
      throw new Error(
        `Language server not loaded, please set languageServer=true to use this method`,
      );
    }
    return this._asyncPostMessage(
      {
        type: "code_completion",
        data: {
          code,
          line: position.line,
          column: position.column,
        },
      },
      "reply:code_completion",
    ).then((data) => data.codeCompletions);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public runPython(code: string): Promise<any> {
    return this.loaded
      .then(() =>
        this._asyncPostMessage(
          {
            type: "run_python",
            data: {
              code,
            },
          },
          "reply:run_python",
        ),
      )
      .then((data) => data.result);
  }

  /**
   * Reboot the Streamlit server.
   * Note that we also need to refresh (rerender) the frontend app after calling this method
   * to reflect the changes on the user-facing side.
   */
  public reboot(entrypoint: string): Promise<void> {
    return this._asyncPostMessage({
      type: "reboot",
      data: {
        entrypoint,
      },
    }).then();
  }

  private _asyncPostMessage(
    message: InMessage,
  ): Promise<ReplyMessageGeneralReply["data"]>;
  private _asyncPostMessage<T extends ReplyMessage["type"]>(
    message: InMessage,
    expectedReplyType: T,
  ): Promise<Extract<ReplyMessage, { type: T }>["data"]>;
  private _asyncPostMessage(
    message: InMessage,
    expectedReplyType = "reply",
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

      this._postMessageTarget.postMessage(message, [channel.port2]);
    });
  }

  /**
   * Process a message coming from the pyodide web worker.
   *
   * @param msg The worker message to process.
   */
  private _processWorkerMessage(msg: OutMessage, port?: MessagePort): void {
    switch (msg.type) {
      case "event:envSetup": {
        this._postMessageTarget.postMessage({
          type: "initData",
          data: this._workerInitData,
        });
        break;
      }
      case "event:loadProgress": {
        this.dispatchEvent(
          new CustomEvent("loadProgress", { detail: msg.data.message }),
        );
        break;
      }
      case "event:loadError": {
        this.dispatchEvent(
          new CustomEvent("loadError", { detail: msg.data.error }),
        );
        break;
      }
      case "event:loadFinished": {
        this._loaded.resolve();
        this.dispatchEvent(new Event("loadFinished"));
        break;
      }
      case "websocket:message": {
        const { payload } = msg.data;
        this.handleWebSocketMessage?.(payload);
        break;
      }
      case "event:moduleAutoLoad": {
        if (port == null) {
          throw new Error("Port is required for moduleAutoLoad event");
        }

        const promise = new Promise<PackageData[]>((resolve, reject) => {
          port.onmessage = (e) => {
            const msg: ModuleAutoLoadMessage = e.data;
            if (msg.type === "moduleAutoLoad:success") {
              resolve(msg.data.loadedPackages);
            } else {
              reject(msg.error);
            }
            port.close();
          };
        });
        this.dispatchEvent(
          new CustomEvent("moduleAutoLoad", {
            detail: {
              packagesToLoad: msg.data.packagesToLoad,
              promise,
            },
          }),
        );
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
    if (isSharedWorker(this._worker)) {
      this._worker.port.close();
    } else {
      this._worker.terminate();
    }
    this._isDisposed = true;
  }
}
