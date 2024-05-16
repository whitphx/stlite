import html2canvas from "html2canvas";

async function generateScreenshot(
  htmlElement: HTMLElement,
  width: number,
  height: number,
  type: string,
  quality = 0.8,
  paddingWidthFactor = 1.1
) {
  const originalCanvas = (await html2canvas(htmlElement, {
    allowTaint: true,
    x: 0,
    y: 0,
    scrollX: 0,
    scrollY: 0,
  })) as HTMLCanvasElement;
  // return originalCanvas.toDataURL(type, quality / 10.0);

  // Code below for resizing image is by ChatGPT (https://chat.openai.com/share/0f6edbe5-3152-4040-9122-d78f8855ae8b)

  // Create a new canvas to resize the original
  const newCanvas = document.createElement("canvas");
  const ctx = newCanvas.getContext("2d");
  if (ctx === null) throw new Error("Could not create 2D context from canvas");

  // Set dimensions of the new canvas
  newCanvas.width = width;
  newCanvas.height = height;

  // Calculate the scaling factor
  const scale = width / (paddingWidthFactor * originalCanvas.width);

  // Calculate the position to draw the original canvas on the new canvas
  const offsetX = (width - originalCanvas.width * scale) / 2;
  const offsetY = 0; // Since we are "zooming" to the top middle, the Y-offset is 0

  // Draw the resized image onto the new canvas
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);

  ctx.drawImage(
    originalCanvas,
    offsetX,
    offsetY,
    originalCanvas.width * scale,
    originalCanvas.height * scale
  );

  // Return the data URL from the new canvas
  return newCanvas.toDataURL(type, quality);
}

export const generateAppScreenshot = async () => {
  const WIDTH = 308;
  const HEIGHT = 176;
  const MAX_SCREENSHOT_SIZE = 8 * 1024; // Generate screenshot that is max 8Kb
  const IMAGE_TYPE = "image/webp";

  const el = document.querySelector(".block-container div") as HTMLDivElement;
  const elPadding = el.style.padding;
  el.style.paddingLeft = "0px";
  el.style.paddingRight = "0px";
  try {
    let quality = 0.7;
    let result = await generateScreenshot(
      el,
      WIDTH,
      HEIGHT,
      IMAGE_TYPE,
      quality
    );
    while (quality > 0.1 && result.length > MAX_SCREENSHOT_SIZE) {
      quality -= 0.1;
      console.warn(
        `Generated screenshot was ${result.length} bytes (>${MAX_SCREENSHOT_SIZE} bytes), reducing quality to ${quality} and trying again...`
      );
      result = await generateScreenshot(el, WIDTH, HEIGHT, IMAGE_TYPE, quality);
    }
    return result;
  } finally {
    // Restore previous padding
    el.style.padding = elPadding;
  }
};
