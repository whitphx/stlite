import { useState, useEffect } from "react";
import { useStliteKernel } from "./StliteKernelProvider";
import { IImage, Image as ImageProto } from "src/autogen/proto";

/**
 * Overrides an image array by loading data from the stlite kernel
 * for in-memory images.
 */
export function useStliteImageList(inputImages: IImage[]) {
  const [images, setImages] = useState(inputImages);

  const kernel = useStliteKernel();
  useEffect(() => {
    if (kernel == null) {
      return;
    }

    let released = false;

    const generatedObjectUrls: string[] = [];
    const imagePromises = inputImages.map((iimage) => {
      const image = iimage as ImageProto; // Ref https://github.com/streamlit/streamlit/blob/b6429b6f03c212fd38496b429d20e0d986877e4c/frontend/src/components/elements/ImageList/ImageList.tsx#L99

      if (!image.url.startsWith("/media")) {
        return image;
      }

      return kernel
        .sendHttpRequest({
          method: "GET",
          path: image.url,
          headers: {},
          body: "",
        })
        .then(({ statusCode, headers, body }) => {
          if (released) {
            return image;
          }
          if (statusCode !== 200) {
            return image;
          }

          const blob = new Blob([body], { type: headers.get("Content-Type") });
          const objectUrl = URL.createObjectURL(blob);
          generatedObjectUrls.push(objectUrl);
          return new ImageProto({
            ...image,
            url: objectUrl,
          });
        });
    });

    Promise.all(imagePromises).then((images) => {
      if (released) {
        return;
      }
      setImages(images);
    });

    return () => {
      released = true;
      generatedObjectUrls.forEach((objectUrl) => {
        URL.revokeObjectURL(objectUrl);
      });
    };
  }, [kernel, inputImages]);

  return images;
}
