import { useEffect, useState } from "react";
import type { StliteKernel } from "../kernel";
import { useStliteKernel } from "./StliteKernelProvider";

export async function resolveMediaObjectUrl(
  kernel: StliteKernel,
  rawUrl: string
): Promise<string> {
  if (!rawUrl.startsWith("/media")) {
    return rawUrl;
  }

  const { statusCode, headers, body } = await kernel.sendHttpRequest({
    method: "GET",
    path: rawUrl,
    headers: {},
    body: "",
  });

  if (statusCode !== 200) {
    throw new Error(`Failed to fetch media object: ${statusCode}`);
  }

  const type = headers.get("Content-Type");
  const blob = new Blob([body], type ? { type } : undefined);
  return URL.createObjectURL(blob);
}

export function resolveLogo<T extends { image: string; iconImage: string }>(
  kernel: StliteKernel,
  logo: T
): Promise<T> {
  return Promise.all([
    resolveMediaObjectUrl(kernel, logo.image),
    resolveMediaObjectUrl(kernel, logo.iconImage),
  ]).then(([image, iconImage]) => {
    logo.image = image;
    logo.iconImage = iconImage;
    return logo;
  });
}

export function useStliteResolvedLogo<
  T extends { image: string; iconImage: string }
>(logo: T | null): T | null {
  const kernel = useStliteKernel();

  const [resolvedLogo, setResolvedLogo] = useState<T | null>(null);
  useEffect(() => {
    let released = false;
    let lastResolvedLogo: T | null = null;

    if (logo == null) {
      setResolvedLogo(null);
    } else {
      resolveLogo(kernel, logo).then((resolvedLogo) => {
        if (released) {
          return;
        }
        if (lastResolvedLogo != null) {
          URL.revokeObjectURL(lastResolvedLogo.image);
          URL.revokeObjectURL(lastResolvedLogo.iconImage);
        }
        lastResolvedLogo = resolvedLogo;
        setResolvedLogo(resolvedLogo);
      });
    }

    return () => {
      if (lastResolvedLogo != null) {
        URL.revokeObjectURL(lastResolvedLogo.image);
        URL.revokeObjectURL(lastResolvedLogo.iconImage);
      }
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

    if (!rawUrl.startsWith("/media")) {
      return;
    }

    let released = false;
    let objectUrl: string | undefined;
    kernel
      .sendHttpRequest({
        method: "GET",
        path: rawUrl,
        headers: {},
        body: "",
      })
      .then(({ statusCode, headers, body }) => {
        if (released) {
          return;
        }
        if (statusCode !== 200) {
          return;
        }

        const type = headers.get("Content-Type");
        const blob = new Blob([body], type ? { type } : undefined);
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      });

    return () => {
      released = true;
      if (objectUrl != null) {
        URL.revokeObjectURL(objectUrl);
      }
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
  inputMediaObjects: T[]
) {
  const [mediaObjects, setMediaObjects] = useState(inputMediaObjects);

  const kernel = useStliteKernel();
  useEffect(() => {
    if (kernel == null) {
      return;
    }

    let released = false;

    const generatedObjectUrls: string[] = [];
    const promises = inputMediaObjects.map((obj) => {
      if (obj.url == null) {
        return obj;
      }

      if (!obj.url.startsWith("/media")) {
        return obj;
      }

      return kernel
        .sendHttpRequest({
          method: "GET",
          path: obj.url,
          headers: {},
          body: "",
        })
        .then(({ statusCode, headers, body }) => {
          if (released) {
            return obj;
          }
          if (statusCode !== 200) {
            return obj;
          }

          const type = headers.get("Content-Type");
          const blob = new Blob([body], type ? { type } : undefined);
          const objectUrl = URL.createObjectURL(blob);
          generatedObjectUrls.push(objectUrl);
          return {
            ...obj,
            url: objectUrl,
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
      generatedObjectUrls.forEach((objectUrl) => {
        URL.revokeObjectURL(objectUrl);
      });
    };
  }, [kernel, inputMediaObjects]);

  return mediaObjects;
}
