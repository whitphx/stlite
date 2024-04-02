import { parentPort } from "node:worker_threads";
import { startWorkerEnv } from "@stlite/kernel/src/worker-runtime";

function loadNodefsMountpoints(): Record<string, string> | undefined {
  const nodefsMountpointsJson = process.env.NODEFS_MOUNTPOINTS;
  if (!nodefsMountpointsJson) {
    return undefined;
  }
  let nodefsMountpoints: Record<string, string>;
  try {
    nodefsMountpoints = JSON.parse(nodefsMountpointsJson);
  } catch (e) {
    console.error(
      `Failed to parse NODEFS_MOUNTPOINTS as JSON: ${nodefsMountpointsJson}`
    );
    return undefined;
  }

  if (typeof nodefsMountpoints !== "object") {
    console.error(
      `NODEFS_MOUNTPOINTS is not an object: ${nodefsMountpointsJson}`
    );
    return undefined;
  }
  if (Object.keys(nodefsMountpoints).some((key) => typeof key !== "string")) {
    console.error(
      `NODEFS_MOUNTPOINTS has non-string keys: ${nodefsMountpointsJson}`
    );
    return undefined;
  }
  if (
    Object.values(nodefsMountpoints).some((value) => typeof value !== "string")
  ) {
    console.error(
      `NODEFS_MOUNTPOINTS has non-string values: ${nodefsMountpointsJson}`
    );
    return undefined;
  }
}

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
