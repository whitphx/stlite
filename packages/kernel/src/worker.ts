import { bootstrapWorker } from "./worker-runtime";

self.onmessage = bootstrapWorker(
  "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js",
  self.postMessage
);
