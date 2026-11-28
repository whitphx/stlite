import { useEffect, useState } from "react";
import type { StliteKernel } from "../kernel";
import { useStliteKernelIfAvailable } from "@stlite/kernel/contexts";

// Ref: https://github.com/streamlit/streamlit/blob/f18f346254049f3b3c09e7a291192ffe4bb8c0f9/frontend/connection/src/DefaultStreamlitEndpoints.ts#L47
const MEDIA_ENDPOINT = "/media";

function resolveStliteObjectUrl(
  kernel: StliteKernel,
  path: string,
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
      return URL.createObjectURL(blob);
    });
}

function resolveStliteObjectUrlIfNeeded(
  kernel: StliteKernel,
  rawUrl: string,
): Promise<string> {
  if (!rawUrl.startsWith(MEDIA_ENDPOINT)) {
    return Promise.resolve(rawUrl);
  }
  return resolveStliteObjectUrl(kernel, rawUrl);
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
        return;
      }
      resolvedUrls.push(resolvedLogo.image);
      resolvedUrls.push(resolvedLogo.iconImage);
      setResolvedLogo(resolvedLogo);
    });

    return () => {
      resolvedUrls.forEach((objectUrl) => {
        URL.revokeObjectURL(objectUrl);
      });
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
export function useStliteMediaObjectUrl(rawUrl: string): string {
  const kernel = useStliteKernelIfAvailable();

  const [url, setUrl] = useState(rawUrl);
  useEffect(() => {
    if (kernel == null) {
      return;
    }

    if (!rawUrl.startsWith(MEDIA_ENDPOINT)) {
      return;
    }

    let released = false;
    const resolvedUrls: string[] = [];
    resolveStliteObjectUrl(kernel, rawUrl).then((resolvedUrl) => {
      if (released) {
        return;
      }
      resolvedUrls.push(resolvedUrl);
      setUrl(resolvedUrl);
    });

    return () => {
      released = true;
      resolvedUrls.forEach((objectUrl) => {
        URL.revokeObjectURL(objectUrl);
      });
    };
  }, [kernel, rawUrl]);

  // Server-backed app (no kernel): the media URL is directly fetchable.
  return kernel == null ? rawUrl : url;
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
      if (!obj.url.startsWith(MEDIA_ENDPOINT)) {
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
    const promises = inputMediaObjects.map((obj) => {
      if (obj.url == null) {
        return obj;
      }

      if (!obj.url.startsWith(MEDIA_ENDPOINT)) {
        return obj;
      }

      return resolveStliteObjectUrl(kernel, obj.url).then((resolvedUrl) => {
        if (released) {
          return obj;
        }
        resolvedUrls.push(resolvedUrl);
        return {
          ...obj,
          url: resolvedUrl,
        };
      });
    });

    Promise.all(promises).then((overriddenMediaObjects) => {
      if (released) {
        return;
      }
      setMediaObjects(overriddenMediaObjects);
    });

    return () => {
      released = true;
      resolvedUrls.forEach((objectUrl) => {
        URL.revokeObjectURL(objectUrl);
      });
    };
  }, [kernel, inputMediaObjects]);

  // Server-backed app (no kernel): every media URL is directly fetchable, so
  // nothing needs resolving (or filtering out while unresolved).
  return kernel == null ? inputMediaObjects : mediaObjects;
}

// Ref: the `app/static/{path:path}` route of Streamlit's server, enabled by `server.enableStaticServing`.
const STATIC_ENDPOINT = "/app/static/";

/**
 * Returns the kernel request path of a URL pointing to a file served by
 * Streamlit's static file serving (e.g. `app/static/font.woff2`,
 * `./app/static/font.woff2` or `/app/static/font.woff2`), or null otherwise.
 * Such URLs are resolved against the Streamlit server in upstream, which
 * doesn't exist in Stlite, so the files must be fetched from the kernel.
 */
export function getStliteStaticFilePath(url: string): string | null {
  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(url) || url.startsWith("//")) {
    // Absolute URLs (e.g. https:, data:, blob:) are directly fetchable.
    return null;
  }
  const path = "/" + url.replace(/^(\.\/|\/)+/, "");
  return path.startsWith(STATIC_ENDPOINT) ? path : null;
}

/**
 * Takes the `theme.fontFaces` entries and overrides the URL of each one
 * pointing to a static file (`app/static/...`) with an object URL of the
 * file data loaded from the Stlite kernel.
 * Entries whose URLs are not resolved yet, or failed to be, are excluded.
 */
export function useStliteResolvedFontFaces<T extends { url?: string | null }>(
  inputFontFaces: T[],
): T[] {
  const kernel = useStliteKernelIfAvailable();

  const [fontFaces, setFontFaces] = useState<T[]>(() =>
    inputFontFaces.filter(
      (fontFace) =>
        fontFace.url == null || getStliteStaticFilePath(fontFace.url) == null,
    ),
  );

  useEffect(() => {
    if (kernel == null) {
      return;
    }

    let released = false;
    const resolvedUrls: string[] = [];
    // Multiple entries may share one file, e.g. for different unicode ranges.
    const resolvingUrls = new Map<string, Promise<string | null>>();
    const resolveUrl = (path: string): Promise<string | null> => {
      let promise = resolvingUrls.get(path);
      if (promise == null) {
        promise = resolveStliteObjectUrl(kernel, path).then(
          (resolvedUrl) => {
            resolvedUrls.push(resolvedUrl);
            return resolvedUrl;
          },
          (error) => {
            console.error(`Failed to load the font file at ${path}:`, error);
            return null;
          },
        );
        resolvingUrls.set(path, promise);
      }
      return promise;
    };

    const promises = inputFontFaces.map((fontFace): Promise<T | null> => {
      const path =
        fontFace.url == null ? null : getStliteStaticFilePath(fontFace.url);
      if (path == null) {
        return Promise.resolve(fontFace);
      }
      return resolveUrl(path).then((resolvedUrl) =>
        resolvedUrl == null ? null : { ...fontFace, url: resolvedUrl },
      );
    });
    Promise.all(promises).then((resolvedFontFaces: (T | null)[]) => {
      if (released) {
        return;
      }
      setFontFaces(
        resolvedFontFaces.filter((fontFace): fontFace is T => fontFace != null),
      );
    });

    return () => {
      released = true;
      // Revoke after the pending requests settle so late ones don't leak.
      Promise.all(resolvingUrls.values()).then(() => {
        resolvedUrls.forEach((objectUrl) => {
          URL.revokeObjectURL(objectUrl);
        });
      });
    };
  }, [kernel, inputFontFaces]);

  // Server-backed app (no kernel): the static file URLs are directly fetchable.
  return kernel == null ? inputFontFaces : fontFaces;
}
