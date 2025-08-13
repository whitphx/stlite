export function loadNodefsMountpoints(): Record<string, string> | undefined {
  const nodefsMountpointsJson = process.env.NODEFS_MOUNTPOINTS;
  if (!nodefsMountpointsJson) {
    return undefined;
  }
  let nodefsMountpoints;
  try {
    nodefsMountpoints = JSON.parse(nodefsMountpointsJson);
  } catch {
    console.error(
      `Failed to parse NODEFS_MOUNTPOINTS as JSON: ${nodefsMountpointsJson}`,
    );
    return undefined;
  }

  if (typeof nodefsMountpoints !== "object") {
    console.error(
      `NODEFS_MOUNTPOINTS is not an object: ${nodefsMountpointsJson}`,
    );
    return undefined;
  }
  if (Array.isArray(nodefsMountpoints)) {
    console.error(`NODEFS_MOUNTPOINTS is an array: ${nodefsMountpointsJson}`);
    return undefined;
  }
  if (Object.keys(nodefsMountpoints).some((key) => typeof key !== "string")) {
    console.error(
      `NODEFS_MOUNTPOINTS has non-string keys: ${nodefsMountpointsJson}`,
    );
    return undefined;
  }
  if (
    Object.values(nodefsMountpoints).some((value) => typeof value !== "string")
  ) {
    console.error(
      `NODEFS_MOUNTPOINTS has non-string values: ${nodefsMountpointsJson}`,
    );
    return undefined;
  }

  return nodefsMountpoints;
}
