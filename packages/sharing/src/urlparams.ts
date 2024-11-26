export function isSharedWorkerMode(): boolean {
  const params = new URLSearchParams(window.location.search);
  return params.has("sharedWorker");
}
