/// <reference lib="WebWorker" />

import { startWorkerEnv } from "./worker-runtime";

const postMessage = (self as DedicatedWorkerGlobalScope).postMessage;
self.onmessage = startWorkerEnv(
  "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js",
  (event, port) => (port ? postMessage(event, [port]) : postMessage(event)),
);
