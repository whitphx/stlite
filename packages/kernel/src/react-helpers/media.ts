import { useEffect, useState } from "react";
import type { StliteKernel } from "../kernel";
import { useStliteKernel } from "./StliteKernelProvider";

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
  const kernel = useStliteKernel();

  const [resolvedLogo, setResolvedLogo] = useState<T | null>(null);
  useEffect(() => {
    let released = false;
    const resolvedUrls: string[] = [];

    if (logo == null) {
      setResolvedLogo(null);
    } else {
      resolveLogo(kernel, logo).then((resolvedLogo) => {
        if (released) {
          return;
        }
        resolvedUrls.push(resolvedLogo.image);
        resolvedUrls.push(resolvedLogo.iconImage);
        setResolvedLogo(resolvedLogo);
      });
    }

    return () => {
      resolvedUrls.forEach((objectUrl) => {
        URL.revokeObjectURL(objectUrl);
      });
      released = true;
    };
  }, [kernel, logo]);

  return resolvedLogo;
}

/**
 * Converts a raw media URL into an object URL
 * if it points to an in-memory file
 * by downloading the data from the stlite kernel.
 */
export function useStliteMediaObjectUrl(rawUrl: string): string {
  const kernel = useStliteKernel();

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

  return url;
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

  const kernel = useStliteKernel();
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

  return mediaObjects;
}
