import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import { generateUniqueId, useUniqueId } from "./useUniqueId";

describe("useUniqueId", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("produces unique ids even with identical randomness", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_000_000);
    vi.spyOn(Math, "random").mockReturnValue(0);

    const first = generateUniqueId(8);
    const second = generateUniqueId(8);

    expect(first).not.toBe(second);
    expect(first).toMatch(/^[a-z]+$/);
    expect(second).toMatch(/^[a-z]+$/);
  });

  it("memoizes the id across renders", () => {
    const { result, rerender } = renderHook(() => useUniqueId());

    const firstId = result.current;
    rerender();

    expect(result.current).toBe(firstId);
  });

  it("regenerates when the requested length changes", () => {
    const { result, rerender } = renderHook(
      ({ length }) => useUniqueId(length),
      { initialProps: { length: 3 } },
    );

    rerender({ length: 4 });

    expect(result.current).toHaveLength(4);
    expect(result.current).not.toBe("aaa");
  });
});
