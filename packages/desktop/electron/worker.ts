import { parentPort } from "node:worker_threads";
import { startWorkerEnv } from "@stlite/kernel/src/worker-runtime";
import { loadNodefsMountpoints } from "./worker-options";

function postMessage(value: any) {
  console.debug("[worker thread] postMessage from worker", value);
  parentPort?.postMessage(value);
}

const handleMessage = startWorkerEnv(
  process.env.PYODIDE_URL as string,
  postMessage,
  {
    nodefsMountpoints: loadNodefsMountpoints(),
  }
);

parentPort?.on("message", ({ data, port }) => {
  console.debug("[worker thread] parentPort.onMessage", { data, port });
  const simEvent = { data, ports: [port] };
  handleMessage(simEvent as any);
});
