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
        sharedWorkerPort.postMessage(event, port ? [port] : undefined),
      undefined,
      appId,
    );
    sharedWorkerPort.start();
  };
}
