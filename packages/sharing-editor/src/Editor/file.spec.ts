import { describe, it, expect } from "vitest";
import { basename } from "./file";

describe("basename", () => {
  it("should return the last part of the path", () => {
    const path = "dir/subdir/file.txt";
    const result = basename(path);
    expect(result).toBe("file.txt");
  });

  it("should return the path itself if there are no slashes", () => {
    const path = "file.txt";
    const result = basename(path);
    expect(result).toBe("file.txt");
  });

  it("should handle paths with trailing slashes", () => {
    const path = "dir/subdir/";
    const result = basename(path);
    expect(result).toBe("");
  });

  it("should handle empty paths", () => {
    const path = "";
    const result = basename(path);
    expect(result).toBe("");
  });
});
