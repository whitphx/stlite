import { describe, it, expect } from "vitest";
import {
  getPackageName,
  normalizePackageName,
  validateRequirements,
} from "./requirements";

describe("getPackageName", () => {
  it.each([
    ["pyarrow", "pyarrow"],
    ["pyarrow<26,>=7.0,!=25.0.0", "pyarrow"],
    ["pyarrow (>=7.0)", "pyarrow"],
    ["streamlit[extra]~=1.27.0", "streamlit"],
    ['tzdata; python_version >= "3.9"', "tzdata"],
    ["pkg @ https://example.com/pkg.whl", "pkg"],
  ])("extracts the name from %j", (requirement, name) => {
    expect(getPackageName(requirement)).toBe(name);
  });
});

describe("normalizePackageName", () => {
  it.each([
    ["PyArrow", "pyarrow"],
    ["typing_extensions", "typing-extensions"],
    ["backports.tarfile", "backports-tarfile"],
    ["a-_.b", "a-b"],
  ])("normalizes %j to %j", (name, normalized) => {
    expect(normalizePackageName(name)).toBe(normalized);
  });
});

describe("validateRequirements", () => {
  const allowedRequirements = [
    [
      "http://files.pythonhosted.org/packages/62/9c/0467dea0a064a998f94c33d03988f33efc744de1a2a550b56b38910cafa2/streamlit-1.13.0-py2.py3-none-any.whl",
    ],
    [
      "https://files.pythonhosted.org/packages/62/9c/0467dea0a064a998f94c33d03988f33efc744de1a2a550b56b38910cafa2/streamlit-1.13.0-py2.py3-none-any.whl",
    ],
  ];
  allowedRequirements.forEach((requirements) => {
    it(`allows http: and https: schemes (requirements=${JSON.stringify(
      requirements,
    )})`, () => {
      expect(validateRequirements(requirements)).toEqual(requirements);
    });
  });

  const notAllowedRequirements = [["emfs:/tmp/foo.whl"], ["file:/tmp/foo.whl"]];
  notAllowedRequirements.forEach((requirements) => {
    it(`throws an error if the requirements include a not allowed scheme (requirements=${JSON.stringify(
      requirements,
    )})`, () => {
      expect(() => validateRequirements(requirements)).toThrow();
    });
  });

  const streamlitRequirements = [
    "streamlit",
    "streamlit==1.27.0",
    "streamlit~=1.27.0",
    "streamlit>1.27.0",
    "streamlit<1.27.0",
    "streamlit>=1.27.0",
    "streamlit<=1.27.0",
    "streamlit[extra]~=1.27.0",
  ];
  streamlitRequirements.forEach((requirement) => {
    it(`filters out the 'streamlit' requirement (requirements=${JSON.stringify(
      requirement,
    )})`, () => {
      expect(
        validateRequirements([
          requirement,
          "streamlit-xxx",
          "xxx-streamlit",
          "numpy",
        ]),
      ).toEqual(["streamlit-xxx", "xxx-streamlit", "numpy"]);
    });
  });
});
