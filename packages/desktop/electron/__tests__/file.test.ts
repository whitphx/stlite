import { walkRead } from "../file";
import * as path from "path";
import * as os from "os";

describe("walkRead", () => {
  it("walks in the specified directory, reads the all child file contents, and returns the pairs of the relative path and the file content", async () => {
    const targetDirPath = path.resolve(__dirname, "./foo/");
    const result = await walkRead(targetDirPath);
    expect(result).toEqual({
      "foo.txt": Buffer.from(`Lorem ipsum dolor sit amet${os.EOL}`),
      "bar/bar.txt": Buffer.from(`consectetur adipiscing elit${os.EOL}`),
    });
  });
});
