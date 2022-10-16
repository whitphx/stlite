import { PyodideInterface } from "pyodide";
import { PromiseDelegate } from "@lumino/coreutils";
import { writeFileWithParents, renameWithParents } from "./file";
import { verifyRequirements } from "./requirements";

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
    command,
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
      "https://cdn.jsdelivr.net/pyodide/v0.21.3/full/pyodide.js"
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

  postProgressMessage("Loading the initially required packages.");
  console.debug("Loading the initially necessary packages");
  await pyodide.loadPackage([
    "ssl", // TODO: This package is only to be loaded from tornado, but it is not actually used. So this should be replaced with a lightweight mock.
  ]);
  console.debug("Loaded the initially necessary packages");

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
  } else if (wheels) {
    postProgressMessage("Installing streamlit and its dependencies.");
    console.debug("Loading tornado, pyarrow, and streamlit");
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    await micropip.install.callKwargs([wheels.tornado, wheels.pyarrow], {
      keep_going: true,
    });
    await micropip.install.callKwargs([wheels.streamlit], { keep_going: true });
    console.debug("Loaded tornado, pyarrow, and streamlit");

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

  postProgressMessage("Loading streamlit package and setting up the loggers.");
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
  // Mock `st.spinner` that does not work well with Pyodide. See https://github.com/whitphx/stlite/issues/64#issuecomment-1274084568
  await pyodide.runPythonAsync(`
    import streamlit
    import contextlib

    @contextlib.contextmanager
    def spinner(*args, **kwargs):
        yield

    streamlit.spinner = spinner
  `);
  console.debug("Mocked some Streamlit functions");

  postProgressMessage("Booting up the Streamlit server.");
  console.debug("Defining the bootstrap functions");
  // Emulate the process in streamlit/web/cli.py
  await pyodide.runPythonAsync(`
    import asyncio
    import os
    import streamlit
    import streamlit.web.bootstrap as bootstrap
    from streamlit.web.server import Server


    class BadArgumentUsage(Exception):
        pass


    class BadParameter(Exception):
        pass


    # Mimic streamlit.web.bootstrap.run() but exclude some code unnecessary for stlite environment
    def run(
        main_script_path,
        command_line,
        args,
        flag_options,
    ) -> None:
        bootstrap._fix_sys_path(main_script_path)
        bootstrap._fix_matplotlib_crash()
        bootstrap._fix_sys_argv(main_script_path, args)
        bootstrap._fix_pydeck_mapbox_api_warning()
        bootstrap._install_pages_watcher(main_script_path)

        # Create the server. It won't start running yet.
        server = Server(main_script_path, command_line)

        # Run the server.
        asyncio.get_event_loop().create_task(server.start())


    def _get_command_line_as_string():
        return ""  # TODO


    def _main_run(file, args=None, flag_options=None):
        if args is None:
            args = []

        if flag_options is None:
            flag_options = {}

        command_line = _get_command_line_as_string()

        # Set a global flag indicating that we're "within" streamlit.
        streamlit._is_running_with_streamlit = True

        # check_credentials()  # Disable credential check on Pyodide

        run(file, command_line, args, flag_options)  # Call this customized run function instead of the original bootstrap.run.


    def main_hello(**kwargs):
        """Runs the Hello World script."""
        from streamlit.hello import Hello

        bootstrap.load_config_options(flag_options=kwargs)
        filename = Hello.__file__
        _main_run(filename, flag_options=kwargs)


    ACCEPTED_FILE_EXTENSIONS = ("py", "py3")


    def main_run(target, args=None, **kwargs):
        """Run a Python script, piping stderr to Streamlit.

        The script can be local or it can be an url. In the latter case, Streamlit
        will download the script to a temporary file and runs this file.

        """
        bootstrap.load_config_options(flag_options=kwargs)

        _, extension = os.path.splitext(target)
        if extension[1:] not in ACCEPTED_FILE_EXTENSIONS:
            if extension[1:] == "":
                raise BadArgumentUsage(
                    "Streamlit requires raw Python (.py) files, but the provided file has no extension.\\nFor more information, please see https://docs.streamlit.io"
                )
            else:
                raise BadArgumentUsage(
                    "Streamlit requires raw Python (.py) files, not %s.\\nFor more information, please see https://docs.streamlit.io"
                    % extension
                )

        # stlite deals with the URL input in the JS layer,
        # so Python code does not take care of it and
        # \`target\` here can be assumed to be a file path, not a URL.

        if not os.path.exists(target):
            raise BadParameter("File does not exist: {}".format(target))
        _main_run(target, args, flag_options=kwargs)
  `);
  console.debug("Defined the bootstrap functions");

  console.debug("Booting up the Streamlit server");
  // Bootstrap
  await pyodide.runPythonAsync(`
  command_kwargs = {
      "server.headless": True,  # Not to open the browser after launching
      "global.dataFrameSerialization": "legacy",  # Not to use PyArrow
      "server.enableXsrfProtection": False,  # Disable XSRF protection as it relies on cookies
      "browser.gatherUsageStats": False,
  }
  `);
  if (command === "hello") {
    await pyodide.runPythonAsync(`main_hello(**command_kwargs)`);
  } else if (command === "run") {
    await pyodide.runPythonAsync(`main_run("${entrypoint}", **command_kwargs)`);
  }
  console.debug("Booted up the Streamlit server");

  console.debug("Setting up the HTTP server");
  // Pull the http server instance from Python world to JS world and set up it.
  await pyodide.runPythonAsync(`
    from tornado.httpserver import HTTP_SERVER
  `); // HTTP_SERVER is set AFTER the streamlit module is loaded.
  httpServer = pyodide.globals.get("HTTP_SERVER").copy();
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
                bootstrap._fix_matplotlib_crash()
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
