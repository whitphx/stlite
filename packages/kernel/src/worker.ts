/// <reference lib="WebWorker" />

import { startWorkerEnv } from "./worker-runtime";
import { generateRandomAppId } from "./app-id";

const pyodideUrl = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.mjs";

if ("postMessage" in self) {
  // Dedicated worker
  self.onmessage = startWorkerEnv(pyodideUrl, (event, port) =>
    port
      ? (self as DedicatedWorkerGlobalScope).postMessage(event, [port])
      : (self as DedicatedWorkerGlobalScope).postMessage(event),
  );
} else {
  // Shared worker
  const existingAppIds: string[] = [];
  (self as SharedWorkerGlobalScope).onconnect = (event: MessageEvent): void => {
    // Generate app ID and ensure it's unique.
    let appId: string;
    do {
      appId = generateRandomAppId(4);
    } while (existingAppIds.includes(appId));
    existingAppIds.push(appId);
    console.debug("SharedWorker mode.", { appId });

    const sharedWorkerPort = event.ports[0];

    sharedWorkerPort.onmessage = startWorkerEnv(
      pyodideUrl,
      (event, port) =>
        port
          ? sharedWorkerPort.postMessage(event, [port])
          : sharedWorkerPort.postMessage(event),
      undefined,
      appId,
    );
    sharedWorkerPort.start();
  };
}
