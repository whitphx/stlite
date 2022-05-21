// Ref: https://github.com/jupyterlite/jupyterlite/blob/f2ecc9cf7189cb19722bec2f0fc7ff5dfd233d47/packages/pyolite-kernel/src/kernel.ts

import { URLExt } from '@jupyterlab/coreutils';

import { PromiseDelegate } from '@lumino/coreutils';

// Since v0.19.0, Pyodide raises an exception when importing not pure Python 3 wheels, whose path does not end with "py3-none-any.whl",
// so configuration on file-loader here is necessary so that the hash is not included in the bundled URL.
// About this change on Pyodide, see the links below:
// https://github.com/pyodide/pyodide/pull/1859
// https://pyodide.org/en/stable/project/changelog.html#micropip
import TORNADO_WHEEL from "!!file-loader?name=pypi/[name].[ext]&context=.!../py/stlite-tornado/dist/stlite_tornado-0.1.0-py3-none-any.whl"  // TODO: Extract the import statement to an auto-generated file like `_pypi.ts` in JupyterLite: https://github.com/jupyterlite/jupyterlite/blob/f2ecc9cf7189cb19722bec2f0fc7ff5dfd233d47/packages/pyolite-kernel/src/_pypi.ts
import PYARROW_WHEEL from "!!file-loader?name=pypi/[name].[ext]&context=.!../py/stlite-pyarrow/dist/stlite_pyarrow-0.1.0-py3-none-any.whl"
import BLINKER_WHEEL from "!!file-loader?name=pypi/[name].[ext]&context=.!../thirdparty/blinker/dist/blinker-1.4-py3-none-any.whl"
import STREAMLIT_WHEEL from "!!file-loader?name=pypi/[name].[ext]&context=.!../../../streamlit/lib/dist/streamlit-1.9.0rc1-py2.py3-none-any.whl"

import worker from '!!raw-loader!./worker';

const DEFAULT_MAIN_SCRIPT_PATH = "/streamlit_app.py"

export class StliteKernel {
  private _isDisposed = false;

  private _worker: Worker;

  private _loaded = new PromiseDelegate<void>();

  constructor(options: StliteKernel.IOptions) {
    const blob = new Blob([this.buildWorkerScript(options).join("\n")]);
    this._worker = new Worker(window.URL.createObjectURL(blob));
    this._worker.onmessage = (e) => {
      this._processWorkerMessage(e.data);
    };

    if (options.mainScriptData) {
      this.setMainScriptData(options.mainScriptData)
    }
  }

  /**
   * Build a list of literal strings to use in the worker
   *
   * Subclasses could use overload this to customize pre-loaded behavior, replace
   * the worker, or any number of other tricks.
   *
   * @param options The instantiation options for a new StliteKernel
   */
  protected buildWorkerScript(options: StliteKernel.IOptions): string[] {
    const { pyodideUrl, mainScriptPath = DEFAULT_MAIN_SCRIPT_PATH } = options;

    const tornadoWheelUrl = URLExt.join(window.location.origin, TORNADO_WHEEL as unknown as string);
    const pyarrowWheelUrl = URLExt.join(window.location.origin, PYARROW_WHEEL as unknown as string);
    const blinkerWheelUrl = URLExt.join(window.location.origin, BLINKER_WHEEL as unknown as string);
    const streamlitWheelUrl = URLExt.join(window.location.origin, STREAMLIT_WHEEL as unknown as string);

    const indexUrl = pyodideUrl.slice(0, pyodideUrl.lastIndexOf('/') + 1);

    return [
      // first we need the pyodide initialization scripts...
      `importScripts("${options.pyodideUrl}");`,
      // ...we also need the location of the index of pyodide-built js/WASM...
      `var indexURL = "${indexUrl}";`,
      `var _tornadoWheelUrl = "${tornadoWheelUrl}"`,
      `var _pyarrowWheelUrl = "${pyarrowWheelUrl}"`,
      `var _blinkerWheelUrl = "${blinkerWheelUrl}"`,
      `var _streamlitWheelUrl = "${streamlitWheelUrl}"`,
      `var _command = "${options.command}"`,  // TODO: Check no special characters are included like \n or ".
      `var _mainScriptPath = "${mainScriptPath}"`,  // TODO: Check no special characters are included like \n or ".
      // ...finally, the worker... which _must_ appear last!
      worker.toString(),
    ];
  }

  get loaded(): Promise<void> {
    return this._loaded.promise;
  }

  public connectWebSocket(path: string): Promise<void> {
    this._worker.postMessage({
      type: "websocket:connect",
      data: {
        path,
      }
    })

    return Promise.resolve() // TODO: Communicate the worker to confirm the connection
  }

  public sendWebSocketMessage(payload: Uint8Array) {
    this._worker.postMessage({
      type: "websocket:send",
      data: {
        payload,
      }
    })
  }

  private handleWebSocketMessage: ((payload: Uint8Array | string) => void) | null = null;
  public onWebSocketMessage(handler: (payload: Uint8Array | string) => void) {
    this.handleWebSocketMessage = handler;
  }

  /**
   * Set a new main script.
   */
  public setMainScriptData(mainScriptData: string) {
    this._worker.postMessage({
      type: "mainscript:set",
      data: {
        mainScriptData
      }
    })
  }

  /**
   * Process a message coming from the pyodide web worker.
   *
   * @param msg The worker message to process.
   */
  private _processWorkerMessage(msg: any): void {
    switch (msg.type) {
      case "LOADED": {
        this._loaded.resolve()
        break;
      }
      case "WEBSOCKET_MESSAGE": {
        const { payload } = msg.data;
        this.handleWebSocketMessage && this.handleWebSocketMessage(payload)
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

/**
 * A namespace for StliteKernel statics.
 */
export namespace StliteKernel {
  /**
   * The instantiation options for a Pyodide kernel
   */
  export interface IOptions {
    /**
     * The URL to fetch Pyodide.
     */
    pyodideUrl: string;

    /**
     * The Streamlit subcommand to run.
     */
    command: "hello" | "run";

    /**
     * The file path on the Pyodide File System (Emscripten FS) to mount the main script.
     */
    mainScriptPath?: string;

    /**
     * The content of the main script.
     */
    mainScriptData?: string;
  }
}
