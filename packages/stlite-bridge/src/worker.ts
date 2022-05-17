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
  pyodide = await loadPyodide({ indexURL });

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
