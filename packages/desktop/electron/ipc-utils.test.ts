import { isDescendantURL } from "./ipc-utils";

describe("isDescendantURL", () => {
  (
    [
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/baz",
        expected: true,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/baz/../qux",
        expected: true,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/../bar",
        expected: true,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/../baz",
        expected: false,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/../baz/qux",
        expected: false,
      },
    ] as const
  ).forEach(({ ancestor, descendant, expected }) => {
    it(`should return ${expected} for ${ancestor} and ${descendant}, dealing with relative paths including ".." correctly`, () => {
      expect(isDescendantURL(ancestor, descendant)).toBe(expected);
    });
  });

  (
    [
      {
        ancestor: "http:///foo/bar",
        descendant: "file:///foo/bar",
        expected: false,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/baz",
        expected: true,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/baz/",
        expected: true,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/baz?qux=quux",
        expected: true,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/baz?qux=quux#corge",
        expected: true,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/baz#corge",
        expected: true,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/baz?qux=quux#corge",
        expected: true,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/baz/qux",
        expected: true,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/baz/qux#corge",
        expected: true,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/baz/qux?quux=quuz#corge",
        expected: true,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/../baz/qux?quux=quuz#corge",
        expected: false,
      },
      {
        ancestor: "http://example.com/foo/bar",
        descendant: "http://example.com/foo/bar/../baz/qux?quux=quuz",
        expected: false,
      },
    ] as const
  ).forEach(({ ancestor, descendant, expected }) => {
    it(`should return ${expected} for ${ancestor} and ${descendant}, dealing with each part of the URLs correctly`, () => {
      expect(isDescendantURL(ancestor, descendant)).toBe(expected);
    });
  });
});
