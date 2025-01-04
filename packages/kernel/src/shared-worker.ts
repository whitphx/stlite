import { startWorkerEnv } from "./worker-runtime";

declare class SharedWorkerGlobalScope {
  onconnect:
    | ((
        this: SharedWorkerGlobalScope,
        ev: MessageEvent<InMessage | OutMessage | ReplyMessage>,
      ) => void)
    | null;
}

const ports = new Set<MessagePort>();

(self as unknown as SharedWorkerGlobalScope).onconnect = (event) => {
  const port = event.ports[0];
  ports.add(port);

  console.debug("SharedWorker: Setting up message handler for new port");
  port.onmessage = startWorkerEnv(
    "/node_modules/pyodide/pyodide.mjs",
    (message, targetPort) => {
      console.debug("SharedWorker: Received message", message);
      // If targetPort is specified, send only to that port
      if (targetPort) {
        console.debug("SharedWorker: Sending to specific port", message);
        targetPort.postMessage(message);
      } else {
        // Otherwise broadcast to all ports
        console.debug("SharedWorker: Broadcasting to all ports", message);
        ports.forEach((p) => p.postMessage(message));
      }
    },
    { shared: true },
  );

  // Add message error handler
  port.addEventListener("messageerror", (event: MessageEvent) => {
    console.error("SharedWorker: Message error", event);
    ports.delete(port);
  });

  port.start();
};

// Cleanup handler
self.addEventListener("close", () => {
  ports.forEach((port) => {
    port.close();
    ports.delete(port);
  });
});
