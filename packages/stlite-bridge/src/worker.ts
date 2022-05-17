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
      '${_blinkerWheelUrl}',
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
        from streamlit.hello import hello

        bootstrap.load_config_options(flag_options=kwargs)
        filename = hello.__file__
        _main_run(filename, flag_options=kwargs)


    main_hello()
  `)

  console.log("Loaded")
}

const pyodideReadyPromise = loadPyodideAndPackages();

/**
 * Process a message sent to the worker.
 *
 * @param event The message event to process
 */
self.onmessage = async (event: MessageEvent): Promise<void> => {
  await pyodideReadyPromise;

  // TODO: Implement the handler
  const reply = {
    message: "pong"
  }

  postMessage(reply);
};
