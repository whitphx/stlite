import { PyodideInterface } from "pyodide";
import { PromiseDelegate } from "@lumino/coreutils";
import { writeFileWithParents, renameWithParents } from "./file";
import { verifyRequirements } from "./requirements";
import { mockPyArrow } from "./mock";

let pyodide: PyodideInterface;

let httpServer: any;

interface StliteWorkerContext extends Worker {
  postMessage(message: OutMessage, transfer: Transferable[]): void;
  postMessage(message: OutMessage, options?: StructuredSerializeOptions): void;
}

// Ref: https://v4.webpack.js.org/loaders/worker-loader/#loading-with-worker-loader
const ctx: StliteWorkerContext = self as any;

const initDataPromiseDelegate = new PromiseDelegate<WorkerInitialData>();

function postProgressMessage(message: string): void {
  ctx.postMessage({
    type: "event:progress",
    data: {
      message,
    },
  });
}

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
    requirements,
    wheels,
    mountedSitePackagesSnapshotFilePath,
    pyodideEntrypointUrl,
  } = await initDataPromiseDelegate.promise;

  postProgressMessage("Loading Pyodide.");

  console.debug("Import the entrypoint script.");
  importScripts(
    pyodideEntrypointUrl ??
      "https://cdn.jsdelivr.net/pyodide/v0.22.1/full/pyodide.js"
  );

  console.debug("Loading Pyodide");
  pyodide = await loadPyodide({
    stdout: console.log,
    stderr: console.error,
  });
  console.debug("Loaded Pyodide");

  // Mount files
  postProgressMessage("Mounting files.");
  Object.keys(files).forEach((path) => {
    const { data, opts } = files[path];

    console.debug(`Write a file "${path}"`);
    writeFileWithParents(pyodide, path, data, opts);
  });

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

    postProgressMessage("Installing the requirements.");
    console.debug("Installing the requirements:", requirements);
    verifyRequirements(requirements); // Blocks the not allowed wheel URL schemes.
    await micropip.install.callKwargs(requirements, { keep_going: true });
    console.debug("Installed the requirements:", requirements);
  } else {
    throw new Error(`Neither snapshot nor wheel files are provided.`);
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
  await pyodide.runPythonAsync(`
    from stlite_server.bootstrap import load_config_options, prepare
    from stlite_server.server import Server

    load_config_options({
        "global.dataFrameSerialization": "legacy",  # Not to use PyArrow
        "browser.gatherUsageStats": False,
        "runner.fastReruns": False,  # Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
    })

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
  const data = event.data;

  // Special case for transmitting the initial data
  if (data.type === "initData") {
    initDataPromiseDelegate.resolve(data.data);
    return;
  }

  await pyodideReadyPromise;

  const messagePort = event.ports[0];

  try {
    switch (data.type) {
      case "websocket:connect": {
        console.debug("websocket:connect", data.data);

        const { path } = data.data;

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
        console.debug("websocket:send", data.data);

        const { payload } = data.data;

        httpServer.receive_websocket_from_js(payload);
        break;
      }
      case "http:request": {
        console.debug("http:request", data.data);

        const { request } = data.data;

        const onResponse = (statusCode: number, _headers: any, _body: any) => {
          const headers = _headers.toJs();
          const body = _body.toJs();
          console.debug({ statusCode, headers, body });

          const reply: HttpResponseMessage = {
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
        const { path, data: fileData, opts } = data.data;

        console.debug(`Write a file "${path}"`);
        writeFileWithParents(pyodide, path, fileData, opts);
        messagePort.postMessage({
          type: "reply",
        });
        break;
      }
      case "file:rename": {
        const { oldPath, newPath } = data.data;

        console.debug(`Rename "${oldPath}" to ${newPath}`);
        renameWithParents(pyodide, oldPath, newPath);
        messagePort.postMessage({
          type: "reply",
        });
        break;
      }
      case "file:unlink": {
        const { path } = data.data;

        console.debug(`Remove "${path}`);
        pyodide.FS.unlink(path);
        messagePort.postMessage({
          type: "reply",
        });
        break;
      }
      case "install": {
        const { requirements } = data.data;

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
    messagePort.postMessage({
      type: "reply",
      error,
    });
  }
};

ctx.postMessage({
  type: "event:start",
});
