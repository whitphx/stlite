import { startWorkerEnv } from "./worker-runtime";

self.onmessage = startWorkerEnv(
  "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js",
  self.postMessage
);
