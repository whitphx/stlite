let httpServer: any;

let mainScriptData: string = "";

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
  // as of 0.17.0 indexURL must be provided
  pyodide = await loadPyodide({
    indexURL,
    stdout: (log: string) => {
      if (log.startsWith("CRITICAL") || log.startsWith("ERROR")) {
        console.error(log)
      } else if (log.startsWith("WARNING")) {
        console.warn(log);
      } else if (log.startsWith("INFO")) {
        console.info(log);
      } else if (log.startsWith("DEBUG")) {
        console.debug(log);
      } else {
        console.log(log);
      }
    },
    stderr: console.error,
  });

  await pyodide.loadPackage(['micropip']);
  await pyodide.runPythonAsync(`
    import micropip
    await micropip.install([
      '${_tornadoWheelUrl}',
      '${_pyarrowWheelUrl}',
    ])
    await micropip.install([
      '${_streamlitWheelUrl}'
    ], keep_going=True);
  `);

  // Fix the Streamlit's logger instantiating strategy, which violates the standard and is problematic for us.
  // See https://github.com/streamlit/streamlit/issues/4742
  await pyodide.runPythonAsync(`
      import logging
      import streamlit.logger

      streamlit.logger.get_logger = logging.getLogger
      streamlit.logger.setup_formatter = None
      streamlit.logger.update_formatter = lambda *a, **k: None
      streamlit.logger.set_log_level = lambda *a, **k: None
  `)
  // Then configure the logger.
  await pyodide.runPythonAsync(`
      import sys

      logging.basicConfig(stream=sys.stdout, level=logging.DEBUG, force=True)

      streamlit_handler = logging.getLogger("streamlit")
      streamlit_handler.setLevel(logging.DEBUG)
  `)

  // Emulate the process in streamlit/cli.py
  await pyodide.runPythonAsync(`
    import os
    import streamlit
    import streamlit.bootstrap as bootstrap


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

        bootstrap.run(file, command_line, args, flag_options)


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
  `)

  // Bootstrap
  await pyodide.runPythonAsync(`
  command_kwargs = {
      "server.headless": True,  # Not to open the browser after launching
      "global.dataFrameSerialization": "legacy",  # Not to use PyArrow
  }
  `)
  if (_command === "hello") {
    await pyodide.runPythonAsync(`main_hello(**command_kwargs)`)
  } else if (_command === "run") {
    pyodide.FS.writeFile(_mainScriptPath, mainScriptData, { encoding: "utf8" });

    await pyodide.runPythonAsync(`main_run("${_mainScriptPath}", **command_kwargs)`)
  }

  // Pull the http server instance from Python world to JS world and set up it.
  await pyodide.runPythonAsync(`
    from tornado.httpserver import HTTP_SERVER
  `)  // HTTP_SERVER is set AFTER the streamlit module is loaded.
  httpServer = pyodide.globals.get('HTTP_SERVER').copy();

  // Set the callback method to receive websocket message from the Streamlit server
  httpServer.set_websocket_sender_fn((messageProxy: any, binary: boolean) => {
    // XXX: Now there is no session mechanism

    if (binary) {
      const buffer = messageProxy.getBuffer("u8");
      messageProxy.destroy();
      const payload = new Uint8ClampedArray(
        buffer.data.buffer,
        buffer.data.byteOffset,
        buffer.data.byteLength
      )
      postMessage({
        type: "websocket:message",
        data: {
          payload: new Uint8Array(payload)
        }
      });
    } else {
      postMessage({
        type: "websocket:message",
        data: {
          payload: messageProxy,
        }
      });
    }
  })

  postMessage({
    type: "event:loaded"
  });
}

const pyodideReadyPromise = loadPyodideAndPackages();

/**
 * Process a message sent to the worker.
 *
 * @param event The message event to process
 */
self.onmessage = async (event: MessageEvent): Promise<void> => {
  await pyodideReadyPromise;
  const data = event.data;
  let results;
  const messageType = data.type;
  const messageContent = data.data;
  switch (messageType) {
    case "websocket:connect": {
      console.log("websocket:connect", messageContent)

      httpServer.start_websocket("/stream")
      break;
    }
    case "websocket:send": {
      console.log("websocket:send", messageContent)

      const { payload } = messageContent

      httpServer.receive_websocket_from_js(payload)
      break;
    }
    case "http:request": {
      console.debug("http:request", messageContent)

      const { request, httpCommId } = messageContent;

      const onResponse = (statusCode: number, _headers: any, _body: any) => {
        const headers = _headers.toJs();
        const body = _body.toJs()
        console.debug({ httpCommId, statusCode, headers, body })

        postMessage({
          type: "http:response",
          data: {
            httpCommId,
            response: {
              statusCode, headers, body
            }
          }
        });
      }

      httpServer.receive_http_from_js(request.method, request.path, request.headers, request.body, onResponse)
      break;
    }
    case "mainscript:set": {
      const { mainScriptData: newMainScriptData } = messageContent;
      mainScriptData = newMainScriptData
      pyodide.FS.writeFile(_mainScriptPath, mainScriptData, { encoding: "utf8" });
      break;
    }
  }

  const reply = {
    type: "reply",
    results,
  }

  postMessage(reply);
};
