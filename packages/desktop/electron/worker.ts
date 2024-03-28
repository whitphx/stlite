import { parentPort } from "node:worker_threads";
import { bootstrapWorker } from "@stlite/kernel/src/worker-runtime";

function postMessage(value: any) {
  console.debug("[worker thread] postMessage from worker", value);
  parentPort?.postMessage(value);
}

const handleMessage = bootstrapWorker(
  process.env.PYODIDE_URL as string,
  postMessage
);

parentPort?.on("message", ({ data, port }) => {
  console.debug("[worker thread] parentPort.onMessage", { data, port });
  const simEvent = { data, ports: [port] };
  handleMessage(simEvent as any);
});
