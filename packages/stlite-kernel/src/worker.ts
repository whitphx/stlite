import { PyodideInterface } from "pyodide";
import { writeFileWithParents, renameWithParents } from "./file";

importScripts("https://cdn.jsdelivr.net/pyodide/v0.21.0/full/pyodide.js");

let pyodide: PyodideInterface;

let httpServer: any;

interface StliteWorkerContext extends Worker {
  postMessage(message: OutMessage, transfer: Transferable[]): void;
  postMessage(message: OutMessage, options?: StructuredSerializeOptions): void;
}

// Ref: https://v4.webpack.js.org/loaders/worker-loader/#loading-with-worker-loader
const ctx: StliteWorkerContext = self as any;

/**
 * A promise waiting for the initial data to be sent from the main thread.
 */
let setInitData: ((initData: WorkerInitialData) => void) | undefined =
  undefined;
const initDataPromise = new Promise<WorkerInitialData>((resolve) => {
  setInitData = resolve;
});

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
  const { command, entrypoint, files, requirements, wheels } =
    await initDataPromise;

  // as of 0.17.0 indexURL must be provided
  postProgressMessage("Loading Pyodide.");
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
    "micropip",
    "ssl", // TODO: This package is only to be loaded from tornado, but it is not actually used. So this should be replaced with a lightweight mock.
  ]);
  console.debug("Loaded the initially necessary packages");

  postProgressMessage("Installing streamlit and its dependencies.");
  console.debug("Loading tornado, pyarrow, and streamlit");
  const micropip = pyodide.pyimport("micropip");
  await micropip.install.callKwargs([wheels.tornado, wheels.pyarrow], {
    keep_going: true,
  });
  await micropip.install.callKwargs([wheels.streamlit], { keep_going: true });
  console.debug("Loaded tornado, pyarrow, and streamlit");

  postProgressMessage("Installing the requirements.");
  console.debug("Installing the requirements:", requirements);
  await micropip.install.callKwargs(requirements, { keep_going: true });
  // The following code is necessary to avoid errors like  `NameError: name '_imp' is not defined`
  // at importing installed packages.
  await pyodide.runPythonAsync(`
    import importlib
    importlib.invalidate_caches()
  `);
  console.debug("Installed the requirements:", requirements);

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

  postProgressMessage("Booting up the Streamlit server.");
  console.debug("Defining the bootstrap functions");
  // Emulate the process in streamlit/web/cli.py
  await pyodide.runPythonAsync(`
    import asyncio
    import os
    import streamlit
    import streamlit.web.bootstrap as bootstrap
    from streamlit.web.server import Server


    def _on_server_start(server):
        print("Streamlit server started")


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
        asyncio.get_event_loop().create_task(server.start(_on_server_start))


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
        from validators import url

        bootstrap.load_config_options(flag_options=kwargs)

        _, extension = os.path.splitext(target)
        if extension[1:] not in ACCEPTED_FILE_EXTENSIONS:
            if extension[1:] == "":
                raise click.BadArgumentUsage(
                    "Streamlit requires raw Python (.py) files, but the provided file has no extension.\\nFor more information, please see https://docs.streamlit.io"
                )
            else:
                raise click.BadArgumentUsage(
                    "Streamlit requires raw Python (.py) files, not %s.\\nFor more information, please see https://docs.streamlit.io"
                    % extension
                )

        if url(target):
            from streamlit.temporary_directory import TemporaryDirectory

            with TemporaryDirectory() as temp_dir:
                from urllib.parse import urlparse
                from streamlit import url_util

                path = urlparse(target).path
                main_script_path = os.path.join(
                    temp_dir, path.strip("/").rsplit("/", 1)[-1]
                )
                # if this is a GitHub/Gist blob url, convert to a raw URL first.
                target = url_util.process_gitblob_url(target)
                _download_remote(main_script_path, target)
                _main_run(main_script_path, args, flag_options=kwargs)
        else:
            if not os.path.exists(target):
                raise click.BadParameter("File does not exist: {}".format(target))
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

const pyodideReadyPromise = loadPyodideAndPackages();

/**
 * Process a message sent to the worker.
 *
 * @param event The message event to process
 */
self.onmessage = async (event: MessageEvent<InMessage>): Promise<void> => {
  const data = event.data;

  // Special case for transmitting the initial data
  if (data.type === "initData") {
    if (setInitData == null) {
      throw new Error("Unexpectedly failed to pass the initial data");
    }
    setInitData(data.data);
    return;
  }

  await pyodideReadyPromise;

  switch (data.type) {
    case "websocket:connect": {
      console.debug("websocket:connect", data.data);

      httpServer.start_websocket(
        "/stream",
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

      const { request, httpCommId } = data.data;

      const onResponse = (statusCode: number, _headers: any, _body: any) => {
        const headers = _headers.toJs();
        const body = _body.toJs();
        console.debug({ httpCommId, statusCode, headers, body });

        ctx.postMessage({
          type: "http:response",
          data: {
            httpCommId,
            response: {
              statusCode,
              headers,
              body,
            },
          },
        });
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
      const messagePort = event.ports[0];
      const { path, data: fileData, opts } = data.data;

      try {
        console.debug(`Write a file "${path}"`);
        writeFileWithParents(pyodide, path, fileData, opts);
        messagePort.postMessage({
          type: "reply",
        });
      } catch (error) {
        messagePort.postMessage({
          type: "reply",
          error,
        });
      }
      break;
    }
    case "file:rename": {
      const messagePort = event.ports[0];
      const { oldPath, newPath } = data.data;

      try {
        console.debug(`Rename "${oldPath}" to ${newPath}`);
        renameWithParents(pyodide, oldPath, newPath);
        messagePort.postMessage({
          type: "reply",
        });
      } catch (error) {
        messagePort.postMessage({
          type: "reply",
          error,
        });
      }
      break;
    }
    case "file:unlink": {
      const messagePort = event.ports[0];
      const { path } = data.data;

      try {
        console.debug(`Remove "${path}`);
        pyodide.FS.unlink(path);
        messagePort.postMessage({
          type: "reply",
        });
      } catch (error) {
        messagePort.postMessage({
          type: "reply",
          error,
        });
      }
      break;
    }
    case "install": {
      const messagePort = event.ports[0];
      const { requirements } = data.data;

      const micropip = pyodide.pyimport("micropip");

      console.debug("Install the requirements:", requirements);
      micropip.install
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
        })
        .catch((error: Error) => {
          console.error("Failed to install", error);
          messagePort.postMessage({
            type: "reply",
            error,
          });
        });
    }
  }
};

ctx.postMessage({
  type: "event:start",
});
