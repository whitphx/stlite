import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { StliteKernelProvider } from "@stlite/kernel/contexts";
import type { StliteKernel } from "../kernel";
import {
  getStliteServedPath,
  useStliteMediaObjectUrl,
  useStliteMediaObjects,
} from "./media";

describe("getStliteServedPath", () => {
  it.each([
    ["/media/abc.png", "/media/abc.png"],
    ["/media/abc.png?x=1", "/media/abc.png?x=1"],
    ["./app/static/logo.png", "/app/static/logo.png"],
    ["app/static/logo.png", "/app/static/logo.png"],
    ["/app/static/logo.png", "/app/static/logo.png"],
    [
      "./app/static/sub/my%20image.png?v=1",
      "/app/static/sub/my%20image.png?v=1",
    ],
    ["./app/static/logo.svg#icon", "/app/static/logo.svg"],
  ])("returns the kernel path for %s", (rawUrl, expected) => {
    expect(getStliteServedPath(rawUrl)).toBe(expected);
  });

  it.each([
    "https://example.com/app/static/logo.png",
    "data:image/png;base64,AAAA",
    "blob:https://example.com/1234",
    "./static/logo.png",
    "../app/static/logo.png",
    "/myapp/app/static/logo.png",
    "./app/statics/logo.png",
  ])("returns null for %s", (rawUrl) => {
    expect(getStliteServedPath(rawUrl)).toBeNull();
  });
});

// A kernel serving the given paths, and 404 for any other.
function createKernel(
  files: Record<string, string>,
  onRequest?: (path: string) => Promise<void>,
): StliteKernel {
  return {
    sendHttpRequest: vi.fn(async ({ path }: { path: string }) => {
      await onRequest?.(path);
      const body = files[path];
      return body == null
        ? { statusCode: 404, headers: new Headers(), body: new Uint8Array() }
        : {
            statusCode: 200,
            headers: new Headers([["Content-Type", "image/svg+xml"]]),
            body: new TextEncoder().encode(body),
          };
    }),
  } as unknown as StliteKernel;
}

function wrapperFor(kernel: StliteKernel) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <StliteKernelProvider kernel={kernel}>{children}</StliteKernelProvider>
    );
  };
}

describe("media hooks", () => {
  let objectUrlCount = 0;
  const revokeObjectURL = vi.fn();

  beforeEach(() => {
    objectUrlCount = 0;
    // jsdom has no object URLs.
    vi.stubGlobal(
      "URL",
      Object.assign(class extends URL {}, {
        createObjectURL: () => `blob:test/${++objectUrlCount}`,
        revokeObjectURL,
      }),
    );
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    revokeObjectURL.mockReset();
  });

  it("keeps the fragment on the object URL but out of the kernel request", async () => {
    const kernel = createKernel({ "/app/static/views.svg": "<svg/>" });
    const { result } = renderHook(
      () => useStliteMediaObjectUrl("./app/static/views.svg#detail"),
      { wrapper: wrapperFor(kernel) },
    );

    await waitFor(() => expect(result.current).toBe("blob:test/1#detail"));
    expect(kernel.sendHttpRequest).toHaveBeenCalledWith(
      expect.objectContaining({ path: "/app/static/views.svg" }),
    );
  });

  it("revokes an object URL that resolves after unmount", async () => {
    let finishRequest = () => {};
    const kernel = createKernel(
      { "/app/static/a.svg": "<svg/>" },
      () => new Promise<void>((resolve) => (finishRequest = resolve)),
    );
    const mediaObjects = [{ url: "./app/static/a.svg#x" }];
    const { unmount } = renderHook(() => useStliteMediaObjects(mediaObjects), {
      wrapper: wrapperFor(kernel),
    });

    unmount();
    await act(async () => finishRequest());

    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test/1");
  });

  it("shows the media objects that load when another one fails", async () => {
    const kernel = createKernel({ "/app/static/b.vtt": "WEBVTT" });
    // Callers pass the same array across renders.
    const mediaObjects = [
      { url: "./app/static/missing.vtt", label: "missing" },
      { url: "https://example.com/a.vtt", label: "remote" },
      { url: "./app/static/b.vtt", label: "b" },
    ];
    const { result } = renderHook(() => useStliteMediaObjects(mediaObjects), {
      wrapper: wrapperFor(kernel),
    });

    // Unresolved ones are left out until they load.
    expect(result.current).toEqual([
      { url: "https://example.com/a.vtt", label: "remote" },
    ]);
    await waitFor(() =>
      expect(result.current).toEqual([
        { url: "https://example.com/a.vtt", label: "remote" },
        { url: "blob:test/1", label: "b" },
      ]),
    );
  });

  it("doesn't return an object URL revoked for a previous kernel", async () => {
    const files = { "/app/static/a.svg": "<svg/>" };
    let kernel = createKernel(files);
    const { result, rerender } = renderHook(
      () => useStliteMediaObjectUrl("./app/static/a.svg"),
      { wrapper: ({ children }) => wrapperFor(kernel)({ children }) },
    );
    await waitFor(() => expect(result.current).toBe("blob:test/1"));

    let finishRequest = () => {};
    kernel = createKernel(
      files,
      () => new Promise<void>((resolve) => (finishRequest = resolve)),
    );
    rerender();

    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test/1");
    expect(result.current).toBe("./app/static/a.svg");
    await act(async () => finishRequest());
    await waitFor(() => expect(result.current).toBe("blob:test/2"));
  });
});
