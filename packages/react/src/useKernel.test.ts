import { describe, expect, it, vi, afterEach } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import type { StliteKernel } from "@stlite/kernel";
import { useKernel } from "./useKernel";
import { createKernel } from "./kernel";

const mockDispose = vi.fn();
const mockKernel = { dispose: mockDispose } as unknown as StliteKernel;

vi.mock("./kernel", () => ({
  createKernel: vi.fn(() => mockKernel),
}));

const dummyOptions = {
  entrypoint: "app.py",
  files: {},
  requirements: [],
  prebuiltPackageNames: [],
  archives: [],
} as Parameters<typeof useKernel>[0];

describe("useKernel", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("creates the kernel on mount with the provided options", async () => {
    const { result } = renderHook(() => useKernel(dummyOptions));

    // After the effect fires the kernel should be set
    expect(result.current).toBe(mockKernel);
    expect(createKernel).toHaveBeenCalledOnce();
    expect(createKernel).toHaveBeenCalledWith(dummyOptions);
  });

  it("calls dispose on unmount", () => {
    const { unmount } = renderHook(() => useKernel(dummyOptions));

    expect(mockDispose).not.toHaveBeenCalled();

    unmount();

    expect(mockDispose).toHaveBeenCalledOnce();
  });

  it("does not re-create the kernel on re-render", () => {
    const { rerender } = renderHook(() => useKernel(dummyOptions));

    rerender();
    rerender();

    expect(createKernel).toHaveBeenCalledOnce();
  });
});
