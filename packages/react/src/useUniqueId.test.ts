import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import { generateUniqueId, useUniqueId } from "./useUniqueId";

describe("useUniqueId", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("generates lowercase ids of the requested length", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const id = generateUniqueId(5);

    expect(id).toBe("aaaaa");
    expect(id).toMatch(/^[a-z]+$/);
  });

  it("memoizes the id across renders", () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.5);

    const { result, rerender } = renderHook(() => useUniqueId());

    const firstId = result.current;
    rerender();

    expect(result.current).toBe(firstId);
    expect(randomSpy).toHaveBeenCalledTimes(8);
  });

  it("regenerates when the requested length changes", () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);

    const { result, rerender } = renderHook(
      ({ length }) => useUniqueId(length),
      { initialProps: { length: 3 } },
    );

    expect(result.current).toBe("aaa");
    expect(randomSpy).toHaveBeenCalledTimes(3);

    randomSpy.mockImplementation(() => 0.5);
    rerender({ length: 4 });

    expect(result.current).toHaveLength(4);
    expect(result.current).not.toBe("aaa");
    expect(randomSpy).toHaveBeenCalledTimes(7);
  });
});
