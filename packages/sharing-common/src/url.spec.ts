import { describe, it, test, expect } from "vitest";
import { processGitblobUrl, parseHash, extractAppDataFromUrlHash } from "./url";

describe("processGitblobUrl", () => {
  const githubUrls: [string, string][] = [
    [
      "https://github.com/aritropaul/streamlit/blob/b72adbcf00c91775db14e739e2ea33d6df9079c3/lib/streamlit/cli.py",
      "https://raw.githubusercontent.com/aritropaul/streamlit/b72adbcf00c91775db14e739e2ea33d6df9079c3/lib/streamlit/cli.py",
    ],
    [
      "https://github.com/streamlit/streamlit/blob/develop/examples/video.py",
      "https://raw.githubusercontent.com/streamlit/streamlit/develop/examples/video.py",
    ],
    [
      "https://github.com/text2gene/text2gene/blob/master/sbin/clinvar.hgvs_citations.sql",
      "https://raw.githubusercontent.com/text2gene/text2gene/master/sbin/clinvar.hgvs_citations.sql",
    ],
    [
      "https://github.com/mekarpeles/math.mx/blob/master/README.md",
      "https://raw.githubusercontent.com/mekarpeles/math.mx/master/README.md",
    ],
    [
      // Test with username and repository name which have hyphens.
      "https://github.com/foo-bar/baz-qux/blob/main/app.py",
      "https://raw.githubusercontent.com/foo-bar/baz-qux/main/app.py",
    ],
    [
      "https://github.com/whitphx/stlite-sample/blob/main/opencv-image-processing.py",
      "https://raw.githubusercontent.com/whitphx/stlite-sample/main/opencv-image-processing.py",
    ],
    [
      // For stlite, which need to fetch the resource from the web browser,
      // the "github.com" URL does not work even if its path points to "/raw" due to CORS problem.
      // It must be converted to the "raw.githubusercontent.com" URL.
      "https://github.com/whitphx/stlite-sample/raw/main/opencv-image-processing.py",
      "https://raw.githubusercontent.com/whitphx/stlite-sample/main/opencv-image-processing.py",
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
      "https://gist.githubusercontent.com/nthmost/b521b80fbd834e67b3f5e271e9548232/raw",
    ],
    [
      "https://gist.github.com/foo-bar/b521b80fbd834e67b3f5e271e9548232",
      "https://gist.githubusercontent.com/foo-bar/b521b80fbd834e67b3f5e271e9548232/raw",
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

describe("parseHash", () => {
  const codeEncDecTestCases: string[] = ["xxx", 'print("%" % 42)'];
  codeEncDecTestCases.forEach((code) => {
    it(`parses the encoded code from the hash, with code = "${code}"`, () => {
      const encodedCode = encodeURIComponent(code);
      expect(parseHash(`code=${encodedCode}`)).toEqual({
        code,
        requirements: [],
      });
    });
  });

  const reqTestCases: [string, string[]][] = [
    ["code=xxx&req=foo", ["foo"]],
    ["code=xxx&req=foo&req=bar", ["foo", "bar"]],
    ["code=xxx&req=foo&req=bar&req=baz", ["foo", "bar", "baz"]],
    ["code=xxx&req=foo&req=bar,baz", ["foo", "bar", "baz"]],
  ];
  reqTestCases.forEach(([hash, requirements]) => {
    it(`parses requirements from "${hash}"`, () => {
      expect(parseHash(hash)).toEqual({ requirements, code: "xxx" });
    });
  });
});

describe("Process share URL", () => {
  it("Should correctly extract App Data from URL", async () => {
    const urlHash =
      "#!ChBzdHJlYW1saXRfYXBwLnB5Em4KEHN0cmVhbWxpdF9hcHAucHkSWgpYaW1wb3J0IHN0cmVhbWxpdCBhcyBzdAoKc3QudGl0bGUoIkhlbGxvIFdvcmxkISIpCnN0LmJ1dHRvbihsYWJlbD0iVGVzdCIsIHR5cGU9InByaW1hcnkiKQ,=";
    // Check if languageServer can be extracted as well
    const parsedParams = await extractAppDataFromUrlHash(urlHash);
    expect(parsedParams).toEqual(
      expect.objectContaining({
        entrypoint: "streamlit_app.py",
        files: {
          "streamlit_app.py": {
            content: {
              $case: "text",
              text: 'import streamlit as st\n\nst.title("Hello World!")\nst.button(label="Test", type="primary")',
            },
          },
        },
        requirements: [],
      }),
    );
  });
});
