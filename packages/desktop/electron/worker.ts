import { parentPort } from "node:worker_threads";
import { startWorkerEnv } from "@stlite/kernel/src/worker-runtime";

function postMessage(value: any) {
  console.debug("[worker thread] postMessage from worker", value);
  parentPort?.postMessage(value);
}

// TODO: Runtime type validation
const nodefsMountpoints =
  process.env.NODEFS_MOUNTPOINTS && JSON.parse(process.env.NODEFS_MOUNTPOINTS);

const handleMessage = startWorkerEnv(
  process.env.PYODIDE_URL as string,
  postMessage,
  {
    nodefsMountpoints,
  }
);

parentPort?.on("message", ({ data, port }) => {
  console.debug("[worker thread] parentPort.onMessage", { data, port });
  const simEvent = { data, ports: [port] };
  handleMessage(simEvent as any);
});
