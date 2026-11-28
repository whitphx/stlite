import { useEffect, useState } from "react";
import type { StliteKernel } from "../kernel";
import { useStliteKernelIfAvailable } from "@stlite/kernel/contexts";

// Ref: https://github.com/streamlit/streamlit/blob/f18f346254049f3b3c09e7a291192ffe4bb8c0f9/frontend/connection/src/DefaultStreamlitEndpoints.ts#L47
const MEDIA_ENDPOINT = "/media";

// Files under `static/` next to the main script, served at `./app/static/`
// when `server.enableStaticServing` is on.
// Ref: https://docs.streamlit.io/develop/concepts/configuration/serving-static-files
const APP_STATIC_URL_PATTERN = /^(?:\.?\/)?app\/static\//;

// Splits `url` into the part before `#` and the fragment, including `#`.
function splitFragment(url: string): [string, string] {
  const index = url.indexOf("#");
  return index < 0 ? [url, ""] : [url.slice(0, index), url.slice(index)];
}

/**
 * Returns the path to request from the Stlite kernel if `rawUrl` points to a
 * resource the Streamlit server serves, or `null` if the browser can fetch
 * `rawUrl` as is. The fragment is never sent to a server, so it is dropped.
 */
export function getStliteServedPath(rawUrl: string): string | null {
  const [url] = splitFragment(rawUrl);
  if (url.startsWith(MEDIA_ENDPOINT)) {
    return url;
  }
  if (APP_STATIC_URL_PATTERN.test(url)) {
    // Relative to the page, these resolve to `<page dir>/app/static/...`
    // on a Streamlit server, so they all mean `/app/static/...` here.
    return "/" + url.replace(/^\.?\//, "");
  }
  return null;
}

// Resolved URLs carry the raw URL's fragment, so strip it to get the object
// URL back. A URL that isn't an object URL is ignored.
function revokeObjectUrl(url: string): void {
  URL.revokeObjectURL(splitFragment(url)[0]);
}

/**
 * Fetches `path` from the Stlite kernel into an object URL, with the
 * fragment of `rawUrl` appended (e.g. an SVG view or a PDF page).
 * Revoke it with `revokeObjectUrl()`.
 */
function resolveStliteObjectUrl(
  kernel: StliteKernel,
  path: string,
  rawUrl: string,
): Promise<string> {
  return kernel
    .sendHttpRequest({
      method: "GET",
      path,
      headers: {},
      body: "",
    })
    .then(({ statusCode, headers, body }) => {
      if (statusCode !== 200) {
        throw new Error(`Failed to fetch media object: ${statusCode}`);
      }

      const type = headers.get("Content-Type");
      const blob = new Blob([body], type ? { type } : undefined);
      return URL.createObjectURL(blob) + splitFragment(rawUrl)[1];
    });
}

// Falls back to `rawUrl` if it can't be resolved, so the logo shows a broken
// image as it would on a Streamlit server missing the file.
function resolveStliteObjectUrlIfNeeded(
  kernel: StliteKernel,
  rawUrl: string,
): Promise<string> {
  const path = getStliteServedPath(rawUrl);
  if (path == null) {
    return Promise.resolve(rawUrl);
  }
  return resolveStliteObjectUrl(kernel, path, rawUrl).catch((error) => {
    console.warn(`Failed to load ${rawUrl}`, error);
    return rawUrl;
  });
}

export function resolveLogo<T extends { image: string; iconImage: string }>(
  kernel: StliteKernel,
  logo: T,
): Promise<T> {
  return Promise.all([
    resolveStliteObjectUrlIfNeeded(kernel, logo.image),
    resolveStliteObjectUrlIfNeeded(kernel, logo.iconImage),
  ]).then(([image, iconImage]) => {
    return {
      ...logo,
      image,
      iconImage,
    };
  });
}

export function useStliteResolvedLogo<
  T extends { image: string; iconImage: string },
>(logo: T | null): T | null {
  const kernel = useStliteKernelIfAvailable();

  const [resolvedLogo, setResolvedLogo] = useState<T | null>(null);
  useEffect(() => {
    if (kernel == null || logo == null) {
      return;
    }

    let released = false;
    const resolvedUrls: string[] = [];

    resolveLogo(kernel, logo).then((resolvedLogo) => {
      if (released) {
        revokeObjectUrl(resolvedLogo.image);
        revokeObjectUrl(resolvedLogo.iconImage);
        return;
      }
      resolvedUrls.push(resolvedLogo.image);
      resolvedUrls.push(resolvedLogo.iconImage);
      setResolvedLogo(resolvedLogo);
    });

    return () => {
      resolvedUrls.forEach(revokeObjectUrl);
      released = true;
    };
  }, [kernel, logo]);

  // Server-backed app (no kernel): the logo URLs are directly fetchable.
  return kernel == null ? logo : resolvedLogo;
}

/**
 * Converts a raw media URL into an object URL
 * if it points to an in-memory file
 * by downloading the data from the stlite kernel.
 */
export function useStliteMediaObjectUrl(rawUrl: string): string;
export function useStliteMediaObjectUrl(
  rawUrl: string | undefined,
): string | undefined;
export function useStliteMediaObjectUrl(
  rawUrl: string | undefined,
): string | undefined {
  const kernel = useStliteKernelIfAvailable();

  // Keyed by the kernel and raw URL it was resolved from, so an object URL
  // that the effect cleanup has revoked is never returned for new ones.
  const [resolved, setResolved] = useState<{
    kernel: StliteKernel;
    rawUrl: string;
    url: string;
  } | null>(null);
  useEffect(() => {
    if (kernel == null || rawUrl == null) {
      return;
    }

    const path = getStliteServedPath(rawUrl);
    if (path == null) {
      return;
    }

    let released = false;
    const resolvedUrls: string[] = [];
    resolveStliteObjectUrl(kernel, path, rawUrl).then(
      (resolvedUrl) => {
        if (released) {
          revokeObjectUrl(resolvedUrl);
          return;
        }
        resolvedUrls.push(resolvedUrl);
        setResolved({ kernel, rawUrl, url: resolvedUrl });
      },
      (error) => {
        console.warn(`Failed to load ${rawUrl}`, error);
      },
    );

    return () => {
      released = true;
      resolvedUrls.forEach(revokeObjectUrl);
    };
  }, [kernel, rawUrl]);

  // Server-backed app (no kernel): the media URL is directly fetchable.
  // Until resolved, the raw URL is returned.
  return kernel != null &&
    resolved?.kernel === kernel &&
    resolved.rawUrl === rawUrl
    ? resolved.url
    : rawUrl;
}

/**
 * Takes an array whose type is Array<{ url?: string | null }>
 * and overrides the url of each element by loading data from the stlite kernel
 * for in-memory resources.
 */
export function useStliteMediaObjects<T extends { url?: string | null }>(
  inputMediaObjects: T[],
) {
  const [mediaObjects, setMediaObjects] = useState<T[]>(
    inputMediaObjects.filter((obj) => {
      if (obj.url == null) {
        return true;
      }
      if (getStliteServedPath(obj.url) == null) {
        return true;
      }

      // Exclude image objects whose URLs are not resolved yet.
      // Some components may send HTTP requests to the URLs (such as https://github.com/streamlit/streamlit/blob/f18f346254049f3b3c09e7a291192ffe4bb8c0f9/frontend/lib/src/components/elements/Video/Video.tsx#L97),
      // which leads to errors, so URLs should be excluded that point to the resources on the Streamlit server that are unreachable.
      return false;
    }),
  );

  const kernel = useStliteKernelIfAvailable();
  useEffect(() => {
    if (kernel == null) {
      return;
    }

    let released = false;

    const resolvedUrls: string[] = [];
    const promises = inputMediaObjects.map((obj): T | Promise<T | null> => {
      const rawUrl = obj.url;
      if (rawUrl == null) {
        return obj;
      }

      const path = getStliteServedPath(rawUrl);
      if (path == null) {
        return obj;
      }

      return resolveStliteObjectUrl(kernel, path, rawUrl).then(
        (resolvedUrl) => {
          if (released) {
            revokeObjectUrl(resolvedUrl);
            return obj;
          }
          resolvedUrls.push(resolvedUrl);
          return {
            ...obj,
            url: resolvedUrl,
          };
        },
        (error) => {
          // Left out, as while unresolved, so that the others still show.
          console.warn(`Failed to load ${rawUrl}`, error);
          return null;
        },
      );
    });

    Promise.all(promises).then((overriddenMediaObjects) => {
      if (released) {
        return;
      }
      setMediaObjects(
        overriddenMediaObjects.filter((obj): obj is T => obj != null),
      );
    });

    return () => {
      released = true;
      resolvedUrls.forEach(revokeObjectUrl);
    };
  }, [kernel, inputMediaObjects]);

  // Server-backed app (no kernel): every media URL is directly fetchable, so
  // nothing needs resolving (or filtering out while unresolved).
  return kernel == null ? inputMediaObjects : mediaObjects;
}
