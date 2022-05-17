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

  await pyodide.runPythonAsync(`
    import streamlit
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
