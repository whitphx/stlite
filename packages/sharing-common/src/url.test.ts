import { describe, test, expect } from "vitest";
import { processGitblobUrl } from "./url";

describe("processGitblobUrl", () => {
  const githubUrls: [string, string][] = [
    [
      "https://github.com/aritropaul/streamlit/blob/b72adbcf00c91775db14e739e2ea33d6df9079c3/lib/streamlit/cli.py",
      "https://github.com/aritropaul/streamlit/raw/b72adbcf00c91775db14e739e2ea33d6df9079c3/lib/streamlit/cli.py",
    ],
    [
      "https://github.com/streamlit/streamlit/blob/develop/examples/video.py",
      "https://github.com/streamlit/streamlit/raw/develop/examples/video.py",
    ],
    [
      "https://github.com/text2gene/text2gene/blob/master/sbin/clinvar.hgvs_citations.sql",
      "https://github.com/text2gene/text2gene/raw/master/sbin/clinvar.hgvs_citations.sql",
    ],
    [
      "https://github.com/mekarpeles/math.mx/blob/master/README.md",
      "https://github.com/mekarpeles/math.mx/raw/master/README.md",
    ],
  ];
  githubUrls.forEach(([target, processed]) => {
    test(`GitHub URL "${target}" is replaced to be "${processed}"`, () => {
      expect(processGitblobUrl(target)).toEqual(processed);
    });
  });

  const gistUrls: [string, string][] = [
    [
      "https://gist.github.com/nthmost/b521b80fbd834e67b3f5e271e9548232",
      "https://gist.github.com/nthmost/b521b80fbd834e67b3f5e271e9548232/raw",
    ],
    [
      "https://gist.github.com/scottyallen/1888e058261fc21f184f6be192bbe131",
      "https://gist.github.com/scottyallen/1888e058261fc21f184f6be192bbe131/raw",
    ],
    [
      "https://gist.github.com/tvst/faf057abbedaccaa70b48216a1866cdd",
      "https://gist.github.com/tvst/faf057abbedaccaa70b48216a1866cdd/raw",
    ],
  ];
  gistUrls.forEach(([target, processed]) => {
    test(`Gist URL "${target}" is replaced to be "${processed}"`, () => {
      expect(processGitblobUrl(target)).toEqual(processed);
    });
  });

  const invalidUrls: string[] = [
    "blah",
    "google.com",
    "http://homestarrunner.com",
    "https://somethinglikegithub.com/withablob",
    "gist.github.com/nothing",
    "https://raw.githubusercontent.com/streamlit/streamlit/develop/examples/video.py",
    "streamlit.io/raw/blob",
  ];
  invalidUrls.forEach((url) => {
    test(`Non-matching URL ("${url}") is not replaced`, () => {
      expect(processGitblobUrl(url)).toEqual(url);
    });
  });
});
