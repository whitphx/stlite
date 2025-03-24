/// <reference lib="WebWorker" />

import type { PackageData, PyodideInterface } from "pyodide";
import type { PyProxy, PyBuffer } from "pyodide/ffi";
import {
  resolveAppPath,
  getAppHomeDir,
  writeFileWithParents,
  renameWithParents,
} from "./file";
import { validateRequirements } from "@stlite/common/src/requirements";
import { initPyodide } from "./pyodide-loader";
import { mockPyArrow } from "./mock";
import {
  dispatchModuleAutoLoading,
  ModuleAutoLoadCallback,
} from "./module-auto-load";
import type {
  WorkerInitialData,
  OutMessage,
  InMessage,
  ReplyMessage,
  ModuleAutoLoadMessage,
} from "./types";
import { importLanguageServerLibraries } from "./language-server/language-server-loader";
import { getCodeCompletions } from "./language-server/code_completion";

export type PostMessageFn = (message: OutMessage, port?: MessagePort) => void;

let initPyodidePromise: Promise<PyodideInterface> | null = null;

async function loadPyodideAndPackages(
  defaultPyodideUrl: string,
  appId: string | undefined,
  initData: WorkerInitialData,
  onModuleAutoLoad: ModuleAutoLoadCallback,
  onProgress: (message: string) => void,
) {
  const {
    entrypoint,
    files,
    archives,
    requirements: unvalidatedRequirements,
    prebuiltPackageNames: prebuiltPackages,
    wheels,
    pyodideUrl = defaultPyodideUrl,
    streamlitConfig,
    idbfsMountpoints,
    nodefsMountpoints,
    moduleAutoLoad,
    env,
    languageServer,
  } = initData;

  const requirements = validateRequirements(unvalidatedRequirements); // Blocks the not allowed wheel URL schemes.

  if (initPyodidePromise) {
    onProgress("Pyodide is already loaded.");
    console.debug("Pyodide is already loaded.");
  } else {
    onProgress("Loading Pyodide.");
    console.debug("Loading Pyodide.");
    initPyodidePromise = initPyodide(pyodideUrl, {
      stdout: console.log,
      stderr: console.error,
    });

    if (wheels) {
      // NOTE: It's important to install the user-specified requirements
      // and the custom Streamlit and stlite wheels in the same `micropip.install` call below,
      // which satisfies the following two requirements:
      // 1. It allows users to specify the versions of Streamlit's dependencies via requirements.txt
      // before these versions are automatically resolved by micropip when installing Streamlit from the custom wheel
      // (installing the user-reqs must be earlier than or equal to installing the custom wheels).
      // 2. It also resolves the `streamlit` package version required by the user-specified requirements to the appropriate version,
      // which avoids the problem of https://github.com/whitphx/stlite/issues/675
      // (installing the custom wheels must be earlier than or equal to installing the user-reqs).
      requirements.unshift(wheels.streamlit);
      requirements.unshift(wheels.stliteLib);
    }

    console.debug("Loaded Pyodide");
  }
  const pyodide: PyodideInterface & { FS: any } = // XXX: `{ FS: any }` is a temporary workaround to fix the type error.
    await initPyodidePromise;

  if (env) {
    // We could've used the env parameter in pyodide initialization,
    // but then some default environment variables like HOME were not set.
    console.debug("Setting environment variables", env);
    const os = pyodide.pyimport("os");
    os.environ.update(pyodide.toPy(env));
    console.debug("Set environment variables", os.environ);
  }

  let useIdbfs = false;
  if (idbfsMountpoints) {
    useIdbfs = true;

    idbfsMountpoints.forEach((mountpoint) => {
      pyodide.FS.mkdir(mountpoint);
      pyodide.FS.mount(pyodide.FS.filesystems.IDBFS, {}, mountpoint);
    });

    await new Promise<void>((resolve, reject) => {
      pyodide.FS.syncfs(true, (err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  if (nodefsMountpoints) {
    Object.entries(nodefsMountpoints).forEach(([mountpoint, path]) => {
      pyodide.FS.mkdir(mountpoint);
      pyodide.FS.mount(
        pyodide.FS.filesystems.NODEFS,
        { root: path },
        mountpoint,
      );
    });
  }

  // Mount files
  onProgress("Mounting files.");
  const pythonFilePaths: string[] = [];
  await Promise.all(
    Object.keys(files).map(async (path) => {
      const file = files[path];
      path = resolveAppPath(appId, path);

      let data: string | ArrayBufferView;
      if ("url" in file) {
        console.debug(`Fetch a file from ${file.url}`);
        data = await fetch(file.url)
          .then((res) => res.arrayBuffer())
          .then((buffer) => new Uint8Array(buffer));
      } else {
        data = file.data;
      }

      console.debug(`Write a file "${path}"`);
      writeFileWithParents(pyodide, path, data, files.opts);

      if (path.endsWith(".py")) {
        pythonFilePaths.push(path);
      }
    }),
  );

  // Unpack archives
  onProgress("Unpacking archives.");
  await Promise.all(
    archives.map(async (archive) => {
      let buffer: Parameters<PyodideInterface["unpackArchive"]>[0];
      if ("url" in archive) {
        console.debug(`Fetch an archive from ${archive.url}`);
        buffer = await fetch(archive.url).then((res) => res.arrayBuffer());
      } else {
        buffer = archive.buffer;
      }
      const { format, options } = archive;

      console.debug(`Unpack an archive`, { format, options });
      pyodide.unpackArchive(buffer, format, options);
    }),
  );

  await pyodide.loadPackage("micropip");
  const micropip = pyodide.pyimport("micropip");

  onProgress("Mocking some packages.");
  console.debug("Mock pyarrow");
  mockPyArrow(pyodide);
  console.debug("Mocked pyarrow");

  // NOTE: Installing packages must be AFTER restoring the archives
  // because they may contain packages to be restored into the site-packages directory.
  onProgress("Installing packages.");

  console.debug("Installing the prebuilt packages:", prebuiltPackages);
  await pyodide.loadPackage(prebuiltPackages);
  console.debug("Installed the prebuilt packages");

  console.debug("Installing the requirements:", requirements);
  await micropip.install.callKwargs(requirements, { keep_going: true });
  console.debug("Installed the requirements");

  if (moduleAutoLoad) {
    const sources = pythonFilePaths.map((path) =>
      pyodide.FS.readFile(path, { encoding: "utf8" }),
    );
    dispatchModuleAutoLoading(pyodide, onModuleAutoLoad, sources);
  }

  // The following code is necessary to avoid errors like `NameError: name '_imp' is not defined`
  // at importing installed packages.
  await pyodide.runPythonAsync(`
import importlib
importlib.invalidate_caches()
`);

  onProgress("Loading streamlit package.");
  console.debug("Loading the Streamlit package");
  // Importing the `streamlit` module takes most of the time,
  // so we first run this step independently for clearer logs and easy exec-time profiling.
  // For https://github.com/whitphx/stlite/issues/427
  await pyodide.runPythonAsync(`
import streamlit.runtime
  `);
  console.debug("Loaded the Streamlit package");

  onProgress("Setting up the loggers.");
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

for name in streamlit.logger._loggers.keys():
    if name == "root":
        name = "streamlit"
    logger = logging.getLogger(name)
    logger.propagate = True
    logger.handlers.clear()
    logger.setLevel(logging.NOTSET)

streamlit.logger._loggers = {}
`);
  // Then configure the logger.
  const logCallback = (levelno: number, msg: string) => {
    if (levelno >= 40) {
      console.error(msg);
    } else if (levelno >= 30) {
      console.warn(msg);
    } else if (levelno >= 20) {
      console.info(msg);
    } else {
      console.debug(msg);
    }
  };
  const setupLoggers = pyodide.runPython(`
def __setup_loggers__(streamlit_level, streamlit_message_format, callback):
    class JsHandler(logging.Handler):
        def emit(self, record):
            msg = self.format(record)
            callback(record.levelno, msg)


    root_message_format = "%(levelname)s:%(name)s:%(message)s"

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_formatter = logging.Formatter(root_message_format)
    root_handler = JsHandler()
    root_handler.setFormatter(root_formatter)
    root_logger.addHandler(root_handler)
    root_logger.setLevel(logging.DEBUG)

    streamlit_logger = logging.getLogger("streamlit")
    streamlit_logger.propagate = False
    streamlit_logger.handlers.clear()
    streamlit_formatter = logging.Formatter(streamlit_message_format)
    streamlit_handler = JsHandler()
    streamlit_handler.setFormatter(streamlit_formatter)
    streamlit_logger.addHandler(streamlit_handler)
    streamlit_logger.setLevel(streamlit_level.upper())

__setup_loggers__`); // This last line evaluates to the function so it is returned from pyodide.runPython() to the JS side.
  const streamlitLogLevel = (
    streamlitConfig?.["logger.level"] ?? "INFO"
  ).toString();
  const streamlitLogMessageFormat =
    streamlitConfig?.["logger.messageFormat"] ?? "%(asctime)s %(message)s";
  setupLoggers(streamlitLogLevel, streamlitLogMessageFormat, logCallback);
  console.debug("Set the loggers");

  onProgress("Mocking some Streamlit functions for the browser environment.");
  console.debug("Mocking some Streamlit functions");
  // Disable caching. See https://github.com/whitphx/stlite/issues/495
  await pyodide.runPythonAsync(`
import streamlit

def is_cacheable_msg(msg):
  return False

streamlit.runtime.runtime.is_cacheable_msg = is_cacheable_msg
`);
  console.debug("Mocked some Streamlit functions");

  if (useIdbfs) {
    onProgress("Setting up the IndexedDB filesystem synchronizer.");
    console.debug("Setting up the IndexedDB filesystem synchronizer");
    // IDBFS needs to be synced by calling `pyodide.FS.syncfs`.
    // Ref: https://emscripten.org/docs/api_reference/Filesystem-API.html#filesystem-api-idbfs
    let fsSyncing = false; // Sometimes `scriptFinishedCallback` is called many time at once so we avoid unnecessary simultaneous calls of `pyodide.FS.syncfs`.
    const scriptFinishedCallback = () => {
      console.debug("The script has finished. Syncing the filesystem.");
      if (!fsSyncing) {
        fsSyncing = true;
        pyodide.FS.syncfs(false, (err: Error) => {
          fsSyncing = false;
          if (err) {
            console.error(err);
          }
        });
      }
    };
    // TODO: Run the callback only for the current app in the case of SharedWorker mode, where multiple runtimes exist.
    // Monkey-patch the `AppSession._on_scriptrunner_event` method to call `scriptFinishedCallback` when the script is finished.
    const setupScriptFinishedCallback = await pyodide.runPython(`
def __setup_script_finished_callback__(callback):
    from streamlit.runtime.app_session import AppSession
    from streamlit.runtime.scriptrunner import ScriptRunnerEvent

    def wrap_app_session_on_scriptrunner_event(original_method):
        def wrapped(self, *args, **kwargs):
            if "event" in kwargs:
                event = kwargs["event"]
                if event == ScriptRunnerEvent.SCRIPT_STOPPED_WITH_SUCCESS or event == ScriptRunnerEvent.SCRIPT_STOPPED_FOR_RERUN or event == ScriptRunnerEvent.SHUTDOWN:
                    callback()
            return original_method(self, *args, **kwargs)
        return wrapped

    AppSession._on_scriptrunner_event = wrap_app_session_on_scriptrunner_event(AppSession._on_scriptrunner_event)

__setup_script_finished_callback__`); // This last line evaluates to the function so it is returned from pyodide.runPython() to the JS side.
    setupScriptFinishedCallback(scriptFinishedCallback);
    console.debug("Set up the IndexedDB filesystem synchronizer");
  }

  if (languageServer) {
    onProgress("Importing Language Server");
    await importLanguageServerLibraries(pyodide, micropip);
  }

  onProgress("Booting up the Streamlit server.");
  // The following Python code is based on streamlit.web.cli.main_run().
  console.debug("Setting up the Streamlit configuration");
  const bootstrap = await pyodide.runPython(`
def __bootstrap__(main_script_path, flag_options, shared_worker_mode):
    from stlite_lib.bootstrap import load_config_options, prepare

    load_config_options(flag_options, shared_worker_mode)

    prepare(main_script_path, [])

__bootstrap__`); // This last line evaluates to the function so it is returned from pyodide.runPython() to the JS side.
  const canonicalEntrypoint = resolveAppPath(appId, entrypoint);
  const streamlitFlagOptions = {
    // gatherUsageStats is disabled as default, but can be enabled explicitly by setting it to true.
    "browser.gatherUsageStats": false,
    ...streamlitConfig,
    "runner.fastReruns": false, // Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
  };
  const sharedWorkerMode = appId != null;
  bootstrap(
    canonicalEntrypoint,
    pyodide.toPy(streamlitFlagOptions),
    sharedWorkerMode,
  );
  console.debug("Set up the Streamlit configuration");

  console.debug("Booting up the Streamlit server");
  const Server = pyodide.pyimport("stlite_lib.server.Server");
  const httpServer = Server(
    canonicalEntrypoint,
    appId ? getAppHomeDir(appId) : null,
  );
  await httpServer.start();
  console.debug("Booted up the Streamlit server");

  return {
    pyodide,
    httpServer,
    micropip,
    initData,
  };
}

export function startWorkerEnv(
  defaultPyodideUrl: string,
  postMessage: PostMessageFn,
  presetInitialData?: Partial<WorkerInitialData>,
  appId?: string,
) {
  function onProgress(message: string): void {
    postMessage({
      type: "event:progress",
      data: {
        message,
      },
    });
  }

  const onModuleAutoLoad = (
    packagesToLoad: string[],
    onLoad: Promise<PackageData[]>,
  ) => {
    const channel = new MessageChannel();

    postMessage(
      {
        type: "event:moduleAutoLoad",
        data: {
          packagesToLoad,
        },
      },
      channel.port2,
    );

    onLoad
      .then((loadedPackages) => {
        channel.port1.postMessage({
          type: "moduleAutoLoad:success",
          data: {
            loadedPackages,
          },
        } as ModuleAutoLoadMessage);
        channel.port1.close();
      })
      .catch((err) => {
        channel.port1.postMessage({
          type: "moduleAutoLoad:error",
          error: err as Error,
        } as ModuleAutoLoadMessage);
        channel.port1.close();
        throw err;
      });
  };

  let pyodideReadyPromise: ReturnType<typeof loadPyodideAndPackages> | null =
    null;

  /**
   * Process a message sent to the worker.
   *
   * @param event The message event to process
   */
  const onmessage = async (event: MessageEvent<InMessage>): Promise<void> => {
    const msg = event.data;

    // Special case for transmitting the initial data
    if (msg.type === "initData") {
      const initialDataFromMessage = msg.data;
      const initData = {
        ...presetInitialData,
        ...initialDataFromMessage,
      };
      console.debug("Initial data", initData);

      pyodideReadyPromise = loadPyodideAndPackages(
        defaultPyodideUrl,
        appId,
        initData,
        onModuleAutoLoad,
        onProgress,
      );

      pyodideReadyPromise
        .then(() => {
          postMessage({
            type: "event:loaded",
          });
        })
        .catch((error) => {
          console.error(error);
          postMessage({
            type: "event:error",
            data: {
              error,
            },
          });
        });
      return;
    }

    if (!pyodideReadyPromise) {
      throw new Error("Pyodide initialization has not been started yet.");
    }
    const v = await pyodideReadyPromise;
    const pyodide = v.pyodide;
    let httpServer = v.httpServer;
    const micropip = v.micropip;
    const { moduleAutoLoad } = v.initData;

    const messagePort = event.ports[0];
    function reply(message: ReplyMessage): void {
      messagePort.postMessage(message);
    }

    try {
      switch (msg.type) {
        case "reboot": {
          console.debug("Reboot the Streamlit server", msg.data);

          const { entrypoint } = msg.data;

          httpServer.stop();

          console.debug("Booting up the Streamlit server");
          const canonicalEntrypoint = resolveAppPath(appId, entrypoint);
          const Server = pyodide.pyimport("stlite_lib.server.Server");
          httpServer = Server(canonicalEntrypoint);
          httpServer.start();
          console.debug("Booted up the Streamlit server");

          reply({
            type: "reply",
          });
          break;
        }
        case "websocket:connect": {
          console.debug("websocket:connect", msg.data);

          const { path } = msg.data;

          httpServer.start_websocket(
            path,
            (message: PyBuffer | string, binary: boolean) => {
              // XXX: Now there is no session mechanism

              if (binary) {
                const messageProxy = message as PyBuffer;
                const buffer = messageProxy.getBuffer("u8");
                messageProxy.destroy();
                const payload = new Uint8ClampedArray(
                  buffer.data.buffer,
                  buffer.data.byteOffset,
                  buffer.data.byteLength,
                );
                postMessage({
                  type: "websocket:message",
                  data: {
                    payload: new Uint8Array(payload),
                  },
                });
              } else {
                const messageStr = message as string;
                postMessage({
                  type: "websocket:message",
                  data: {
                    payload: messageStr,
                  },
                });
              }
            },
          );

          reply({
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

          const onResponse = (
            statusCode: number,
            _headers: PyProxy,
            _body: PyProxy,
          ) => {
            const headers = new Map<string, string>(_headers.toJs()); // Pyodide converts dict to LiteralMap, not Map, which can't be cloned and sent to the main thread. So we convert it to Map here. Ref: https://github.com/pyodide/pyodide/pull/4576
            const body = _body.toJs();
            console.debug({ statusCode, headers, body });

            reply({
              type: "http:response",
              data: {
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
            decodeURIComponent(request.path),
            request.headers,
            request.body,
            onResponse,
          );
          break;
        }
        case "file:write": {
          const { path: rawPath, data: fileData, opts } = msg.data;
          const path = resolveAppPath(appId, rawPath);

          if (
            moduleAutoLoad &&
            typeof fileData === "string" &&
            path.endsWith(".py")
          ) {
            // Auto-install must be dispatched before writing the file
            // because its promise should be set before saving the file triggers rerunning.
            console.debug(`Auto install the requirements in ${path}`);

            dispatchModuleAutoLoading(pyodide, onModuleAutoLoad, [fileData]);
          }

          console.debug(`Write a file "${path}"`);
          writeFileWithParents(pyodide, path, fileData, opts);
          reply({
            type: "reply",
          });
          break;
        }
        case "file:rename": {
          const { oldPath: rawOldPath, newPath: rawNewPath } = msg.data;
          const oldPath = resolveAppPath(appId, rawOldPath);
          const newPath = resolveAppPath(appId, rawNewPath);

          console.debug(`Rename "${oldPath}" to ${newPath}`);
          renameWithParents(pyodide, oldPath, newPath);
          reply({
            type: "reply",
          });
          break;
        }
        case "file:unlink": {
          const { path: rawPath } = msg.data;
          const path = resolveAppPath(appId, rawPath);

          console.debug(`Remove "${path}`);
          pyodide.FS.unlink(path);
          reply({
            type: "reply",
          });
          break;
        }
        case "file:read": {
          const { path, opts } = msg.data;

          console.debug(`Read "${path}"`);
          const content = pyodide.FS.readFile(path, opts);
          reply({
            type: "reply:file:read",
            data: {
              content,
            },
          });
          break;
        }
        case "install": {
          const { requirements: unvalidatedRequirements } = msg.data;

          const requirements = validateRequirements(unvalidatedRequirements); // Blocks the not allowed wheel URL schemes.
          console.debug("Install the requirements:", requirements);
          await micropip.install
            .callKwargs(requirements, { keep_going: true })
            .then(() => {
              console.debug("Successfully installed");
              reply({
                type: "reply",
              });
            });
          break;
        }
        case "setEnv": {
          const { env } = msg.data;
          const os = pyodide.pyimport("os");
          os.environ.update(pyodide.toPy(env));

          console.debug("Successfully set the environment variables", env);
          reply({
            type: "reply",
          });
          break;
        }
        case "language-server:code_completion": {
          const codeCompletions = await getCodeCompletions(msg.data, pyodide);
          reply({
            type: "reply:language-server:code_completion",
            data: codeCompletions,
          });
          break;
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

      reply({
        type: "reply",
        error: cloneableError,
      });
    }
  };

  postMessage({
    type: "event:start",
  });

  return onmessage;
}
