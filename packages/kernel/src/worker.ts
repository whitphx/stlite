import { startWorkerEnv } from "./worker-runtime";
import { generateRandomAppId } from "./app-id";

const pyodideUrl = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";

if ("postMessage" in self) {
  // Dedicated worker
  self.onmessage = startWorkerEnv(pyodideUrl, (event, port) =>
    (self as DedicatedWorkerGlobalScope).postMessage(
      event,
      port ? [port] : undefined,
    ),
  );
} else {
  // Shared worker
  (self as SharedWorkerGlobalScope).onconnect = (event: MessageEvent): void => {
    const appId = generateRandomAppId();
    console.debug("SharedWorker mode.", { appId });

    const sharedWorkerPort = event.ports[0];

    sharedWorkerPort.onmessage = startWorkerEnv(
      pyodideUrl,
      (event, port) =>
        sharedWorkerPort.postMessage(event, port ? [port] : undefined),
      undefined,
      appId,
    );
    sharedWorkerPort.start();
  };
}
