import { walkRead } from "../file";
import * as path from "path";

describe("walkRead", () => {
  it("walks in the specified directory, reads the all child file contents, and returns the pairs of the relative path and the file content", async () => {
    const targetDirPath = path.resolve(__dirname, "./foo/");
    const result = await walkRead(targetDirPath);
    expect(result).toEqual({
      "foo.txt": Buffer.from("Lorem ipsum dolor sit amet\n"),
      "bar/bar.txt": Buffer.from("consectetur adipiscing elit\n"),
    });
  });

  it("walks in the specified directory, reads the all child file contents, and returns the pairs of the absolute path and the file content if relative=false", async () => {
    const targetDirPath = path.resolve(__dirname, "./foo/");
    const result = await walkRead(targetDirPath, false);
    expect(result).toEqual({
      [path.resolve(targetDirPath, "./foo.txt")]: Buffer.from(
        "Lorem ipsum dolor sit amet\n"
      ),
      [path.resolve(targetDirPath, "./bar/bar.txt")]: Buffer.from(
        "consectetur adipiscing elit\n"
      ),
    });
  });
});
