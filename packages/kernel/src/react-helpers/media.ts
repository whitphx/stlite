import { useEffect, useState } from "react";
import { useStliteKernel } from "./StliteKernelProvider";

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

        const blob = new Blob([body], { type: headers.get("Content-Type") });
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

          const blob = new Blob([body], { type: headers.get("Content-Type") });
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
