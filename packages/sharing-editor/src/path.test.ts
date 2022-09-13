import { isValidFilePath } from "./path";

describe("isValidFilePath", () => {
  // Ref: https://stackoverflow.com/questions/13862965/how-to-validate-a-unix-path
  const testCases: { path: string; expected: boolean }[] = [
    { path: "foo.py", expected: true },
    { path: "foo", expected: true },
    { path: "foo/", expected: false },
    { path: "foo/./bar.py", expected: false },
    { path: "foo/../bar.py", expected: false },
    { path: "/foo.py", expected: true },
    { path: "/", expected: false },
    { path: "", expected: false },
    { path: " ", expected: false },
    { path: " /", expected: false },
    { path: " /foo.py", expected: false },
  ];
  testCases.forEach(({ path, expected }) => {
    it(`returns ${expected} for ${path}`, () => {
      expect(isValidFilePath(path)).toBe(expected);
    });
  });
});
