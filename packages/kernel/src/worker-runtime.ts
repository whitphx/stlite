/// <reference lib="WebWorker" />

import type { PackageData, PyodideInterface } from "pyodide";
import type { PyProxy } from "pyodide/ffi";
import {
  resolveAppPath,
  getAppHomeDir,
  writeFileWithParents,
  renameWithParents,
} from "./file";
import { validateRequirements } from "@stlite/common";
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
  InMessageHttpRequest,
  ReplyMessage,
  ModuleAutoLoadMessage,
} from "./types";
import { getCodeCompletions } from "./code_completion";
import {
  AsgiWebSocketSession,
  buildWebSocketScope,
  dispatchHttp,
  type AsgiApp,
  type AsgiEvent,
} from "./asgi-bridge";
import { HttpCookieJar } from "./http-cookie";

export type PostMessageFn = (
  message: OutMessage,
  transfer?: Transferable[],
) => void;

let initPyodidePromise: Promise<PyodideInterface> | null = null;
let micropipInstallPromiseChain: Promise<void> = Promise.resolve();
let systemPackagesInstalled = false;

async function loadPyodideAndPackages(
  defaultPyodideUrl: string,
  appId: string | undefined,
  initData: WorkerInitialData,
  onModuleAutoLoad: ModuleAutoLoadCallback,
  onProgress: (message: string) => void,
) {
  const {
    files,
    archives,
    requirements: unvalidatedRequirements,
    prebuiltPackageNames: prebuiltPackages,
    wheels,
    installs,
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
    console.debug("Loaded Pyodide");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const runInstall = async (): Promise<void> => {
    console.debug("Installing the packages:", {
      requirements,
      systemPackagesInstalled,
    });
    const systemPackagesToInstall: string[] = [];
    if (!systemPackagesInstalled) {
      console.debug("System packages will be installed");
      // NOTE: It's important to install the user-specified requirements
      // and the core packages such as the customized Streamlit and stlite-lib wheels in the same `micropip.install` call below,
      // which satisfies the following two requirements:
      // 1. It allows users to specify the versions of Streamlit's dependencies via requirements.txt
      // before these versions are automatically resolved by micropip when installing Streamlit from the custom wheel
      // (installing the user-reqs must be earlier than or equal to installing the custom wheels).
      // 2. It also resolves the `streamlit` package version required by the user-specified requirements to the appropriate version,
      // which avoids the problem of https://github.com/whitphx/stlite/issues/675
      // (installing the custom wheels must be earlier than or equal to installing the user-reqs).
      if (wheels) {
        // Streamlit 1.57.0's regenerated proto code (protoc 7.x) raises
        // VersionError when loaded against protobuf-runtime 6.x. Pyodide
        // 0.29.3 still bundles the 6.31.1 wheel, so we pin a 7.x range
        // explicitly. Listing it before the streamlit wheel lets micropip
        // resolve to PyPI rather than fall back to Pyodide's bundled copy.
        // See https://protobuf.dev/support/cross-version-runtime-guarantee
        systemPackagesToInstall.push("protobuf>=7.34.1,<8");
        systemPackagesToInstall.push(wheels.streamlit);
        systemPackagesToInstall.push(wheels.stliteLib);
      }
      if (languageServer) {
        systemPackagesToInstall.push("jedi");
      }
    }
    const packagesToInstall = [...systemPackagesToInstall, ...requirements];
    console.debug("Installing the packages:", packagesToInstall);
    await micropip.install.callKwargs(packagesToInstall, { keep_going: true });
    if (systemPackagesToInstall.length > 0) {
      console.debug("Installed the system packages");
      systemPackagesInstalled = true;
    }
    console.debug("Installed the packages");
  };

  // Make sure runInstall is executed only once at the same time across all the sessions.
  // Use a per-call promise to observe errors, while keeping the shared chain from remaining rejected.
  const currentInstall = micropipInstallPromiseChain.then(() => runInstall());
  micropipInstallPromiseChain = currentInstall.catch((error) => {
    console.error("Package installation failed:", error);
    // Swallow the error here so that the shared chain is reset to a resolved state
    // and future sessions can retry installation.
  });
  await currentInstall;

  if (installs) {
    console.debug("Installing the additional requirements");
    await Promise.all(
      installs.map(({ requirements: unvalidatedRequirements, options }) => {
        const requirements = validateRequirements(unvalidatedRequirements); // Blocks the not allowed wheel URL schemes.
        console.debug("Installing the requirements:", requirements);
        return micropip.install.callKwargs(requirements, options ?? {});
      }),
    );
  }

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

  // The code below is based on streamlit.web.cli.main_run().
  console.debug("Setting up the Streamlit configuration");
  const { load_config_options } = pyodide.pyimport("stlite_lib.bootstrap");
  const streamlitFlagOptions = {
    // gatherUsageStats is disabled as default, but can be enabled explicitly by setting it to true.
    "browser.gatherUsageStats": false,
    ...streamlitConfig,
    "runner.fastReruns": false, // Fast reruns do not work well with the async script runner of stlite. See https://github.com/whitphx/stlite/pull/550#issuecomment-1505485865.
  };
  const sharedWorkerMode = appId != null;
  load_config_options(pyodide.toPy(streamlitFlagOptions), sharedWorkerMode);
  console.debug("Set up the Streamlit configuration");

  // Load Jedi if the language server is enabled.
  let jedi: PyProxy | undefined;
  if (languageServer) {
    onProgress("Loading auto-completion engine.");
    console.debug("Loading Jedi");
    try {
      jedi = (await pyodide.pyimport("jedi")) as PyProxy;
      console.debug("Loaded Jedi");
    } catch (error) {
      console.error("Failed to load Jedi:", error);
      jedi = undefined;
    }
  }

  return {
    pyodide,
    micropip,
    jedi,
    initData,
  };
}

interface AsgiAppHandle {
  /** ASGI callable bound to the App + per-app home_dir, suitable for
   * dispatchHttp / AsgiWebSocketSession. */
  asgiApp: AsgiApp;
  /** Opaque state returned by run_lifespan_startup; must be passed to
   * run_lifespan_shutdown when tearing down. */
  lifespanState: PyProxy;
}

async function bootstrapApp(
  pyodide: PyodideInterface,
  appId: string | undefined,
  entrypoint: string,
): Promise<AsgiAppHandle> {
  const canonicalEntrypoint = resolveAppPath(appId, entrypoint);

  // The code below is based on streamlit.web.cli.main_run().
  console.debug("Preparing the Streamlit environment");
  const { prepare } = pyodide.pyimport("stlite_lib.bootstrap");
  prepare(canonicalEntrypoint, []);
  console.debug("Prepared the Streamlit environment");

  console.debug("Booting up the Streamlit ASGI app");
  const asgiModule = pyodide.pyimport("stlite_lib.asgi_app");
  const rawApp = asgiModule.create_app(canonicalEntrypoint);
  const lifespanState = (await asgiModule.run_lifespan_startup(
    rawApp,
  )) as PyProxy;
  // Bind runtime_contextvar in the shared JS-call context so non-ASGI
  // paths (notably streamlit.testing.v1.AppTest, which the kernel test
  // suite uses) can reach the runtime via Runtime.get_instance(). ASGI
  // traffic doesn't depend on this — call_asgi rebinds per request.
  // Must run synchronously from JS (not awaited) so the set lands in
  // the shared module context, not a task-local one.
  asgiModule.bind_runtime_to_current_context(rawApp);
  // make_call_asgi binds the App + home_dir into a single ASGI callable so
  // the JS side doesn't have to re-supply them on every dispatch (one
  // callable per app, reused across requests).
  const asgiApp = asgiModule.make_call_asgi(
    rawApp,
    appId ? getAppHomeDir(appId) : undefined,
  ) as unknown as AsgiApp;
  console.debug("Booted up the Streamlit ASGI app");

  return { asgiApp, lifespanState };
}

async function shutdownApp(
  pyodide: PyodideInterface,
  handle: AsgiAppHandle,
): Promise<void> {
  const { run_lifespan_shutdown } = pyodide.pyimport("stlite_lib.asgi_app");
  await run_lifespan_shutdown(handle.lifespanState);
  handle.lifespanState.destroy();
}

export function startWorkerEnv(
  defaultPyodideUrl: string,
  postMessage: PostMessageFn,
  presetInitialData?: Partial<WorkerInitialData>,
  appId?: string,
) {
  function onProgress(message: string): void {
    postMessage({
      type: "event:loadProgress",
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
      [channel.port2],
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
  let appReadyPromise: Promise<AsgiAppHandle> | null = null;
  let wsSession: AsgiWebSocketSession | null = null;
  const httpCookieJar = new HttpCookieJar();

  async function warmUpXsrfCookie(
    asgiApp: AsgiApp,
    requestPath: string,
  ): Promise<void> {
    console.debug("stlite XSRF warmup before upload", { requestPath });
    const response = await dispatchHttp(
      asgiApp,
      httpCookieJar.applyToRequest({
        method: "GET",
        path: "/_stcore/health",
        headers: { host: "stlite.local" },
        body: "",
      }),
    );
    httpCookieJar.storeFromResponse(response.headers);
    console.debug("stlite XSRF warmup response", {
      requestPath,
      statusCode: response.statusCode,
    });
  }

  async function dispatchHttpWithCookies(
    asgiApp: AsgiApp,
    request: InMessageHttpRequest["data"]["request"],
  ) {
    const decodedRequest = {
      ...request,
      path: decodeURIComponent(request.path),
    };

    if (httpCookieJar.needsXsrfWarmup(decodedRequest)) {
      await warmUpXsrfCookie(asgiApp, decodedRequest.path);
    }

    const requestWithCookies = httpCookieJar.applyToRequest(decodedRequest);
    const response = await dispatchHttp(asgiApp, requestWithCookies);
    httpCookieJar.storeFromResponse(response.headers);
    return response;
  }

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
        .then(({ pyodide }) => {
          onProgress("Booting up the Streamlit server.");
          appReadyPromise = bootstrapApp(pyodide, appId, initData.entrypoint);
          return appReadyPromise;
        })
        .then(() => {
          postMessage({
            type: "event:loadFinished",
          });
        })
        .catch((error) => {
          console.error(error);
          postMessage({
            type: "event:loadError",
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
    if (!appReadyPromise) {
      throw new Error("Streamlit ASGI app has not been started yet.");
    }
    const v = await pyodideReadyPromise;
    const pyodide = v.pyodide;
    const micropip = v.micropip;
    const jedi = v.jedi;
    const { moduleAutoLoad } = v.initData;

    let appHandle = await appReadyPromise;

    const messagePort = event.ports[0];
    function reply(message: ReplyMessage): void {
      messagePort.postMessage(message);
    }

    function forwardWebsocketEventToClient(event: AsgiEvent): void {
      if (event.type !== "websocket.send") {
        // websocket.close events are observed when the server tears down;
        // we don't currently surface them to the client.
        return;
      }
      const bytes = event.bytes as Uint8Array | undefined;
      if (bytes) {
        // Transfer the underlying ArrayBuffer to the main thread to avoid a
        // structured-clone copy (mirrors the legacy on_message path that
        // did messageProxy.toJs() and then transferred `.buffer`).
        // bytes always owns a regular ArrayBuffer (not SharedArrayBuffer)
        // since it came from Pyodide's memoryview → Uint8Array bridge.
        const ab = bytes.buffer.slice(
          bytes.byteOffset,
          bytes.byteOffset + bytes.byteLength,
        ) as ArrayBuffer;
        postMessage({ type: "websocket:message", data: { payload: ab } }, [ab]);
        return;
      }
      const text = event.text as string | undefined;
      if (typeof text === "string") {
        postMessage({ type: "websocket:message", data: { payload: text } });
      }
    }

    try {
      switch (msg.type) {
        case "reboot": {
          console.debug("Reboot the Streamlit server", msg.data);

          const { entrypoint } = msg.data;

          if (wsSession) {
            await wsSession.close();
            wsSession = null;
          }
          await shutdownApp(pyodide, appHandle);
          httpCookieJar.clear();

          console.debug("Booting up the Streamlit ASGI app");
          appReadyPromise = bootstrapApp(pyodide, appId, entrypoint);
          appHandle = await appReadyPromise;
          console.debug("Booted up the Streamlit ASGI app");

          reply({
            type: "reply",
          });
          break;
        }
        case "websocket:connect": {
          console.debug("websocket:connect", msg.data);

          const { path } = msg.data;
          const cookieHeader = httpCookieJar.getCookieHeader();

          if (wsSession) {
            // The current kernel only manages one WebSocket per app at a
            // time. Tear down the previous one before opening a new one.
            await wsSession.close();
            wsSession = null;
          }

          // The frontend doesn't pass headers on this message; synthesize a
          // minimal set so Starlette's WS handler accepts the connection.
          // Origin matches Host → _is_origin_allowed returns true.
          const scope = buildWebSocketScope({
            path,
            headers: {
              host: "stlite.local",
              origin: "http://stlite.local",
              ...(cookieHeader ? { cookie: cookieHeader } : {}),
            },
          });
          wsSession = new AsgiWebSocketSession(
            appHandle.asgiApp,
            scope,
            forwardWebsocketEventToClient,
          );
          await wsSession.start();

          reply({
            type: "reply",
          });
          break;
        }
        case "websocket:send": {
          console.debug("websocket:send", msg.data);

          const { payload } = msg.data;

          if (wsSession) {
            wsSession.postClientMessage(payload);
          }
          break;
        }
        case "http:request": {
          console.debug("http:request", msg.data);

          const { request } = msg.data;
          dispatchHttpWithCookies(appHandle.asgiApp, request)
            .then((response) => {
              reply({
                type: "http:response",
                data: {
                  response: {
                    statusCode: response.statusCode,
                    headers: new Map(response.headers.entries()),
                    body: response.body,
                  },
                },
              });
            })
            .catch((error) => {
              console.error("http:request dispatch failed", error);
              reply({
                type: "http:response",
                data: {
                  response: {
                    statusCode: 500,
                    headers: new Map([
                      ["content-type", "text/plain; charset=utf-8"],
                    ]),
                    body: new TextEncoder().encode(
                      `Internal server error: ${String(error)}`,
                    ),
                  },
                },
              });
            });
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
          const { requirements: unvalidatedRequirements, options } = msg.data;

          const requirements = validateRequirements(unvalidatedRequirements); // Blocks the not allowed wheel URL schemes.
          console.debug("Install the requirements:", requirements);
          await micropip.install
            .callKwargs(requirements, options ?? {})
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
        case "code_completion": {
          if (!jedi) {
            throw new Error("Jedi is not installed");
          }
          const { code, line, column } = msg.data;
          const codeCompletions = await getCodeCompletions(jedi, code, {
            line,
            column,
          });
          reply({
            type: "reply:code_completion",
            data: {
              codeCompletions,
            },
          });
          break;
        }
        case "run_python": {
          const { code } = msg.data;
          console.debug("Run python code", code);

          const rawResult = await pyodide.runPythonAsync(code);
          let result: unknown;
          if (rawResult instanceof pyodide.ffi.PyProxy) {
            console.debug("The result is a PyProxy object");
            result = rawResult.toJs();
            rawResult.destroy();
            console.debug("Converted the result to a JS object", result);
          } else {
            result = rawResult;
            console.debug("The result is a JS primitive", result);
          }

          reply({
            type: "reply:run_python",
            data: {
              result,
            },
          });
          break;
        }
        case "add_mock_package": {
          const { name, version, modules, persistent } = msg.data;
          console.debug("Add a mock package:", {
            name,
            version,
            modules,
            persistent,
          });
          micropip.add_mock_package.callKwargs({
            name,
            version,
            modules: pyodide.toPy(modules),
            persistent,
          });
          reply({
            type: "reply",
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
    type: "event:envSetup",
  });

  return onmessage;
}
