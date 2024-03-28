import { bootstrapWorker } from "./worker-runtime";
import type { OutMessage } from "./types";

interface StliteWorkerContext extends DedicatedWorkerGlobalScope {
  postMessage(message: OutMessage, transfer: Transferable[]): void;
  postMessage(message: OutMessage, options?: StructuredSerializeOptions): void;
}

// Ref: https://v4.webpack.js.org/loaders/worker-loader/#loading-with-worker-loader
const ctx = self as StliteWorkerContext;

const DEFAULT_PYODIDE_URL =
  "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";

self.onmessage = bootstrapWorker(DEFAULT_PYODIDE_URL, ctx.postMessage);
