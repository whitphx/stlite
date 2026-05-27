import { DefaultStreamlitEndpoints } from "@streamlit/connection";
import { getLogger } from "loglevel";

const LOG = getLogger("stlite-endpoints-patch");

// Stlite's ConnectionManager.getBaseUriParts() returns
// `https://stlite.invalid/` as the server URI so that upstream-built URLs
// (component, media, etc.) can be intercepted by stlite's in-app worker
// bridge instead of going to the network. `.invalid` is an RFC 2606 reserved
// TLD that never resolves. See packages/kernel/src/react-helpers/ConnectionManager.ts.
const STLITE_INVALID_HOSTNAME = "stlite.invalid";

const originalCheckSourceUrlResponse =
  DefaultStreamlitEndpoints.prototype.checkSourceUrlResponse;

// Stlite: upstream's `checkSourceUrlResponse` is a side-effect health check
// that `fetch()`es `sourceUrl` to surface 4xx/5xx (or network) failures to
// the embedding host. When `sourceUrl` points at our `stlite.invalid`
// sentinel host (Custom Component index.html, media URLs that haven't been
// rewritten to a blob URL yet, download URLs, etc.) the fetch *always* fails
// with `ERR_NAME_NOT_RESOLVED`, polluting the console and the host's
// client-error stream. The actual rendering already routes through
// `kernel.sendHttpRequest()` (see `CustomComponentIFrame`, `media.ts`), so
// the health-check has no useful signal to contribute for these URLs.
DefaultStreamlitEndpoints.prototype.checkSourceUrlResponse = async function (
  sourceUrl: string,
  componentName: string,
  customComponentName?: string,
): Promise<void> {
  let hostname: string | undefined;
  try {
    hostname = new URL(sourceUrl).hostname;
  } catch {
    // Malformed URL — let upstream handle it so its existing error path
    // (sendClientErrorToHost) still fires.
  }

  if (hostname === STLITE_INVALID_HOSTNAME) {
    LOG.debug(
      `Skipping checkSourceUrlResponse for stlite-bridged URL: ${sourceUrl}`,
    );
    return;
  }

  return originalCheckSourceUrlResponse.call(
    this,
    sourceUrl,
    componentName,
    customComponentName,
  );
};
