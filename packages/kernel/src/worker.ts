import { startWorkerEnv } from "./worker-runtime";

self.onmessage = startWorkerEnv(
  "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js",
  self.postMessage
);
