import { describe, it, expect, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { StliteKernelProvider } from "@stlite/kernel/contexts";
import type { StliteKernel } from "../kernel";
import { getStliteStaticFilePath, useStliteResolvedFontFaces } from "./media";

describe("getStliteStaticFilePath", () => {
  [
    { url: "app/static/font.woff2", expected: "/app/static/font.woff2" },
    { url: "./app/static/font.woff2", expected: "/app/static/font.woff2" },
    { url: "/app/static/font.woff2", expected: "/app/static/font.woff2" },
    {
      url: "app/static/fonts/My Font.ttf",
      expected: "/app/static/fonts/My Font.ttf",
    },
    { url: "https://example.com/app/static/font.woff2", expected: null },
    { url: "//example.com/app/static/font.woff2", expected: null },
    { url: "data:font/woff2;base64,AAAA", expected: null },
    { url: "blob:https://example.com/uuid", expected: null },
    { url: "fonts/font.woff2", expected: null },
    { url: "app/staticfont.woff2", expected: null },
  ].forEach(({ url, expected }) => {
    it(`returns ${JSON.stringify(expected)} for "${url}"`, () => {
      expect(getStliteStaticFilePath(url)).toBe(expected);
    });
  });
});

describe("useStliteResolvedFontFaces", () => {
  const fontFaces = [
    { family: "Inter", url: "app/static/Inter.ttf", weightRange: "500" },
    { family: "Inter", url: "app/static/Inter.ttf", weightRange: "700" },
    { family: "Remote", url: "https://example.com/remote.woff2" },
    { family: "Missing", url: "app/static/missing.ttf" },
  ];

  it("replaces static file URLs with object URLs of the data from the kernel", async () => {
    const sendHttpRequest = vi.fn(async ({ path }: { path: string }) =>
      path === "/app/static/Inter.ttf"
        ? {
            statusCode: 200,
            headers: new Headers({ "Content-Type": "font/ttf" }),
            body: new Uint8Array([0, 1, 2]),
          }
        : { statusCode: 404, headers: new Headers(), body: new Uint8Array() },
    );
    const kernel = { sendHttpRequest } as unknown as StliteKernel;
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:resolved");
    const revokeObjectURL = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    const wrapper = ({ children }: { children: ReactNode }) => (
      <StliteKernelProvider kernel={kernel}>{children}</StliteKernelProvider>
    );
    const { result, unmount } = renderHook(
      () => useStliteResolvedFontFaces(fontFaces),
      { wrapper },
    );

    // Unresolved static fonts are excluded at first.
    expect(result.current).toEqual([fontFaces[2]]);

    await waitFor(() => {
      expect(result.current).toEqual([
        { ...fontFaces[0], url: "blob:resolved" },
        { ...fontFaces[1], url: "blob:resolved" },
        fontFaces[2],
      ]);
    });
    // A file shared by multiple entries is fetched once.
    expect(sendHttpRequest).toHaveBeenCalledTimes(2);
    expect(createObjectURL).toHaveBeenCalledTimes(1);

    unmount();
    await waitFor(() => {
      expect(revokeObjectURL).toHaveBeenCalledWith("blob:resolved");
    });
    vi.restoreAllMocks();
  });

  it("returns the font faces as-is without a kernel", () => {
    const { result } = renderHook(() => useStliteResolvedFontFaces(fontFaces));
    expect(result.current).toBe(fontFaces);
  });
});
