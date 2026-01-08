import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, renderHook } from "@testing-library/react";
import {
  generateUniqueId,
  toAlphabeticString,
  useUniqueId,
} from "./useUniqueId";

describe("toAlphabeticString", () => {
  it("converts 0 to 'a'", () => {
    expect(toAlphabeticString(0)).toBe("a");
  });

  it("converts single-digit numbers correctly", () => {
    expect(toAlphabeticString(1)).toBe("b");
    expect(toAlphabeticString(2)).toBe("c");
    expect(toAlphabeticString(25)).toBe("z");
  });

  it("converts to two characters when exceeding alphabet length", () => {
    expect(toAlphabeticString(26)).toBe("ba");
    expect(toAlphabeticString(27)).toBe("bb");
    expect(toAlphabeticString(51)).toBe("bz");
  });

  it("converts larger numbers correctly", () => {
    expect(toAlphabeticString(52)).toBe("ca");
    expect(toAlphabeticString(675)).toBe("zz");
    expect(toAlphabeticString(676)).toBe("baa");
  });

  it("produces only alphabetical characters", () => {
    for (let i = 0; i < 1000; i++) {
      const result = toAlphabeticString(i);
      expect(result).toMatch(/^[a-z]+$/);
      expect(result.length).toBeGreaterThan(0);
    }
  });

  it("produces unique strings for different inputs", () => {
    const results = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const result = toAlphabeticString(i);
      expect(results.has(result)).toBe(false);
      results.add(result);
    }
  });
});

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
