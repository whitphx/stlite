import type Pyodide from "pyodide";
import { PromiseDelegate } from "@stlite/common";
import { writeFileWithParents, renameWithParents } from "./file";
import { verifyRequirements } from "./requirements";
import { mockPyArrow } from "./mock";
import type {
  WorkerInitialData,
  OutMessage,
  InMessage,
  ReplyMessageHttpResponse,
} from "./types";

let pyodide: Pyodide.PyodideInterface;

let httpServer: any;

interface StliteWorkerContext extends DedicatedWorkerGlobalScope {
  postMessage(message: OutMessage, transfer: Transferable[]): void;
  postMessage(message: OutMessage, options?: StructuredSerializeOptions): void;
}

// Ref: https://v4.webpack.js.org/loaders/worker-loader/#loading-with-worker-loader
const ctx = self as StliteWorkerContext;

const initDataPromiseDelegate = new PromiseDelegate<WorkerInitialData>();

function postProgressMessage(message: string): void {
  ctx.postMessage({
    type: "event:progress",
    data: {
      message,
    },
  });
}

async function initPyodide(
  pyodideUrl: string,
  loadPyodideOptions: Parameters<typeof Pyodide.loadPyodide>[0]
): Promise<Pyodide.PyodideInterface> {
  // Ref: https://github.com/jupyterlite/pyodide-kernel/blob/v0.1.3/packages/pyodide-kernel/src/kernel.ts#L55
  const indexUrl = pyodideUrl.slice(0, pyodideUrl.lastIndexOf("/") + 1);

  // Ref: https://github.com/jupyterlite/pyodide-kernel/blob/v0.1.3/packages/pyodide-kernel/src/worker.ts#L40-L54
  let loadPyodide: typeof Pyodide.loadPyodide;
  if (pyodideUrl.endsWith(".mjs")) {
    // note: this does not work at all in firefox
    const pyodideModule: typeof Pyodide = await import(
      /* webpackIgnore: true */ pyodideUrl
    );
    loadPyodide = pyodideModule.loadPyodide;
  } else {
    importScripts(pyodideUrl);
    loadPyodide = (self as any).loadPyodide;
  }
  return loadPyodide({ ...loadPyodideOptions, indexURL: indexUrl });
}

const DEFAULT_PYODIDE_URL =
  "https://cdn.jsdelivr.net/pyodide/v0.23.3/full/pyodide.js";

/**
 * Load Pyodided and initialize the interpreter.
 *
 * NOTE: This implementation is based on JupyterLite@v0.1.0a16.
 *       Since v0.1.0a17, a wrapper around micropip, piplite, has been introduced
 *       and the importing strategy of pyolite and other packages has been changed.
 *       We might need to catch up it.
 *       https://github.com/jupyterlite/jupyterlite/pull/310
 */
async function loadPyodideAndPackages() {
  const {
    entrypoint,
    files,
    archives,
    requirements,
    wheels,
    mountedSitePackagesSnapshotFilePath,
    pyodideUrl = DEFAULT_PYODIDE_URL,
    streamlitConfig,
  } = await initDataPromiseDelegate.promise;

  postProgressMessage("Loading Pyodide.");

  console.debug("Loading Pyodide");
  pyodide = await initPyodide(pyodideUrl, {
    stdout: console.log,
    stderr: console.error,
  });
  console.debug("Loaded Pyodide");

  // Mount files
  postProgressMessage("Mounting files.");
  await Promise.all(
    Object.keys(files).map(async (path) => {
      const file = files[path];

      let data: string | ArrayBufferView;
      if ("url" in file) {
        console.debug(`Fetch a file from ${file.url}`);
        data = await fetch(file.url)
          .then((res) => res.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer));
      } else {
        data = file.data;
      }
      const { opts } = files[path];

      console.debug(`Write a file "${path}"`);
      writeFileWithParents(pyodide, path, data, opts);
    })
  );

  // Unpack archives
  postProgressMessage("Unpacking archives.");
  await Promise.all(
    archives.map(async (archive) => {
      let buffer: Parameters<Pyodide.PyodideInterface["unpackArchive"]>[0];
      if ("url" in archive) {
        console.debug(`Fetch an archive from ${archive.url}`);
        buffer = await fetch(archive.url).then((res) => res.arrayBuffer());
      } else {
        buffer = archive.buffer;
      }
      const { format, options } = archive;

      console.debug(`Unpack an archive`, { format, options });
      pyodide.unpackArchive(buffer, format, options);
    })
  );

  if (mountedSitePackagesSnapshotFilePath) {
    // Restore the site-packages director(y|ies) from the mounted snapshot file.
    postProgressMessage("Restoring the snapshot.");

    await pyodide.runPythonAsync(`import tarfile, shutil, site`);

    // Remove "site-packages" directories such as '/lib/python3.10/site-packages'
    // assuming these directories will be extracted from the snapshot archive.
    await pyodide.runPythonAsync(`
      site_packages_dirs = site.getsitepackages()
      for site_packages in site_packages_dirs:
          shutil.rmtree(site_packages)
    `);
    console.debug(`Unarchive ${mountedSitePackagesSnapshotFilePath}`);
    await pyodide.runPythonAsync(`
      with tarfile.open("${mountedSitePackagesSnapshotFilePath}", "r") as tar_gz_file:
          tar_gz_file.extractall("/")
    `);
    console.debug("Restored the snapshot");

    postProgressMessage("Mocking some packages.");
    console.debug("Mock pyarrow");
    mockPyArrow(pyodide);
    console.debug("Mocked pyarrow");
  } else if (wheels) {
    postProgressMessage("Installing streamlit and its dependencies.");
    console.debug("Loading stlite-server, and streamlit");
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install.callKwargs([wheels.stliteServer], {
      keep_going: true,
    });
    await micropip.install.callKwargs([wheels.streamlit], { keep_going: true });
    console.debug("Loaded stlite-server, and streamlit");

    postProgressMessage("Mocking some packages.");
    console.debug("Mock pyarrow");
    mockPyArrow(pyodide);
    console.debug("Mocked pyarrow");
  } else {
    throw new Error(`Neither snapshot nor wheel files are provided.`);
  }

  if (requirements.length > 0) {
    postProgressMessage("Installing the requirements.");
    console.debug("Installing the requirements:", requirements);
    verifyRequirements(requirements); // Blocks the not allowed wheel URL schemes.
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install.callKwargs(requirements, { keep_going: true });
    console.debug("Installed the requirements:", requirements);
  }

  // The following code is necessary to avoid errors like  `NameError: name '_imp' is not defined`
  // at importing installed packages.
  await pyodide.runPythonAsync(`
    import importlib
    importlib.invalidate_caches()
  `);

  postProgressMessage("Loading streamlit package.");
  console.debug("Loading the Streamlit package");
  // Importing the `streamlit` module takes most of the time,
  // so we first run this step independently for clearer logs and easy exec-time profiling.
  // For https://github.com/whitphx/stlite/issues/427
  await pyodide.runPythonAsync(`
      import streamlit.runtime
      import streamlit.web
  `);
  console.debug("Loaded the Streamlit package");

  postProgressMessage("Setting up the loggers.");
  console.debug("Setting the loggers");
  // Fix the Streamlit's logger instantiating strategy, which violates the standard and is problematic for us.
  // See https://github.com/streamlit/streamlit/issues/4742
  await pyodide.runPythonAsync(`
      import logging
      import streamlit.logger

      streamlit.logger.get_logger = logging.getLogger
      streamlit.logger.setup_formatter = None
      streamlit.logger.update_formatter = lambda *a, **k: None
      streamlit.logger.set_log_level = lambda *a, **k: None
  `);
  // Then configure the logger.
  const logCallback = (msg: string) => {
    if (msg.startsWith("CRITICAL") || msg.startsWith("ERROR")) {
      console.error(msg);
    } else if (msg.startsWith("WARNING")) {
      console.warn(msg);
    } else if (msg.startsWith("INFO")) {
      console.info(msg);
    } else if (msg.startsWith("DEBUG")) {
      console.debug(msg);
    } else {
      console.log(msg);
    }
  };
  self.__logCallback__ = logCallback;
  await pyodide.runPythonAsync(`
      from js import __logCallback__


      class JsHandler(logging.Handler):
          def emit(self, record):
              msg = self.format(record)
              __logCallback__(msg)


      main_formatter = logging.Formatter("%(levelname)s:%(name)s:%(message)s")

      js_handler = JsHandler()
      js_handler.setFormatter(main_formatter)

      root_logger = logging.getLogger()
      root_logger.handlers.clear()
      root_logger.addHandler(js_handler)
      root_logger.setLevel(logging.DEBUG)

      streamlit_handler = logging.getLogger("streamlit")
      streamlit_handler.setLevel(logging.DEBUG)
  `);
  console.debug("Set the loggers");

  postProgressMessage(
    "Mocking some Streamlit functions for the browser environment."
  );
  console.debug("Mocking some Streamlit functions");
  // Disable caching. See https://github.com/whitphx/stlite/issues/495
  await pyodide.runPythonAsync(`
    import streamlit

    def is_cacheable_msg(msg):
        return False

    streamlit.runtime.runtime.is_cacheable_msg = is_cacheable_msg
  `);
  console.debug("Mocked some Streamlit functions");

  postProgressMessage("Booting up the Streamlit server.");
  console.debug("Booting up the Streamlit server");
  // The following Python code is based on streamlit.web.cli.main_run().
  self.__streamlitFlagOptions__ = {
    ...streamlitConfig,
    "browser.gatherUsageStats": false,
    "runner.fastReruns": false, // Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
  };
  await pyodide.runPythonAsync(`
    from stlite_server.bootstrap import load_config_options, prepare
    from stlite_server.server import Server
    from js import __streamlitFlagOptions__

    flag_options = __streamlitFlagOptions__.to_py()
    load_config_options(flag_options)

    main_script_path = "${entrypoint}"
    command_line = None
    args = []

    prepare(main_script_path, args)

    server = Server(main_script_path, command_line)
    server.start()
  `);
  console.debug("Booted up the Streamlit server");

  console.debug("Setting up the HTTP server");
  // Pull the http server instance from Python world to JS world and set up it.
  httpServer = pyodide.globals.get("server").copy();
  console.debug("Set up the HTTP server");

  ctx.postMessage({
    type: "event:loaded",
  });
}

const pyodideReadyPromise = loadPyodideAndPackages().catch((error) => {
  ctx.postMessage({
    type: "event:error",
    data: {
      error,
    },
  });
  throw error;
});

/**
 * Process a message sent to the worker.
 *
 * @param event The message event to process
 */
self.onmessage = async (event: MessageEvent<InMessage>): Promise<void> => {
  const msg = event.data;

  // Special case for transmitting the initial data
  if (msg.type === "initData") {
    initDataPromiseDelegate.resolve(msg.data);
    return;
  }

  await pyodideReadyPromise;

  const messagePort = event.ports[0];

  try {
    switch (msg.type) {
      case "websocket:connect": {
        console.debug("websocket:connect", msg.data);

        const { path } = msg.data;

        httpServer.start_websocket(
          path,
          (messageProxy: any, binary: boolean) => {
            // XXX: Now there is no session mechanism

            if (binary) {
              const buffer = messageProxy.getBuffer("u8");
              messageProxy.destroy();
              const payload = new Uint8ClampedArray(
                buffer.data.buffer,
                buffer.data.byteOffset,
                buffer.data.byteLength
              );
              ctx.postMessage({
                type: "websocket:message",
                data: {
                  payload: new Uint8Array(payload),
                },
              });
            } else {
              ctx.postMessage({
                type: "websocket:message",
                data: {
                  payload: messageProxy,
                },
              });
            }
          }
        );

        messagePort.postMessage({
          type: "reply",
        });
        break;
      }
      case "websocket:send": {
        console.debug("websocket:send", msg.data);

        const { payload } = msg.data;

        httpServer.receive_websocket_from_js(payload);
        break;
      }
      case "http:request": {
        console.debug("http:request", msg.data);

        const { request } = msg.data;

        const onResponse = (statusCode: number, _headers: any, _body: any) => {
          const headers = _headers.toJs();
          const body = _body.toJs();
          console.debug({ statusCode, headers, body });

          const reply: ReplyMessageHttpResponse = {
            type: "http:response",
            data: {
              response: {
                statusCode,
                headers,
                body,
              },
            },
          };
          messagePort.postMessage(reply);
        };

        httpServer.receive_http_from_js(
          request.method,
          request.path,
          request.headers,
          request.body,
          onResponse
        );
        break;
      }
      case "file:write": {
        const { path, data: fileData, opts } = msg.data;

        console.debug(`Write a file "${path}"`);
        writeFileWithParents(pyodide, path, fileData, opts);
        messagePort.postMessage({
          type: "reply",
        });
        break;
      }
      case "file:rename": {
        const { oldPath, newPath } = msg.data;

        console.debug(`Rename "${oldPath}" to ${newPath}`);
        renameWithParents(pyodide, oldPath, newPath);
        messagePort.postMessage({
          type: "reply",
        });
        break;
      }
      case "file:unlink": {
        const { path } = msg.data;

        console.debug(`Remove "${path}`);
        pyodide.FS.unlink(path);
        messagePort.postMessage({
          type: "reply",
        });
        break;
      }
      case "install": {
        const { requirements } = msg.data;

        const micropip = pyodide.pyimport("micropip");

        console.debug("Install the requirements:", requirements);
        verifyRequirements(requirements); // Blocks the not allowed wheel URL schemes.
        await micropip.install
          .callKwargs(requirements, { keep_going: true })
          .then(() => {
            if (requirements.includes("matplotlib")) {
              return pyodide.runPythonAsync(`
                from stlite_server.bootstrap import _fix_matplotlib_crash
                _fix_matplotlib_crash()
              `);
            }
          })
          .then(() => {
            console.debug("Successfully installed");
            messagePort.postMessage({
              type: "reply",
            });
          });
      }
    }
  } catch (error) {
    console.error(error);

    if (!(error instanceof Error)) {
      throw error;
    }

    // The `error` object may contain non-serializable properties such as function (for example Pyodide.FS.ErrnoError which has a `.setErrno` function),
    // so it must be converted to a plain object before sending it to the main thread.
    // Otherwise, the following error will be thrown:
    // `Uncaught (in promise) DOMException: Failed to execute 'postMessage' on 'MessagePort': #<Object> could not be cloned.`
    // Also, the JSON.stringify() and JSON.parse() approach like https://stackoverflow.com/a/42376465/13103190
    // does not work for Error objects because the Error object is not enumerable.
    // So we use the following approach to clone the Error object.
    const cloneableError = new Error(error.message);
    cloneableError.name = error.name;
    cloneableError.stack = error.stack;

    messagePort.postMessage({
      type: "reply",
      error: cloneableError,
    });
  }
};

ctx.postMessage({
  type: "event:start",
});
