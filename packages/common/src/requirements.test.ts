import { describe, it, expect } from "vitest";
import { validateRequirements } from "./requirements";

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
      requirements
    )})`, () => {
      expect(validateRequirements(requirements)).toEqual(requirements);
    });
  });

  const notAllowedRequirements = [["emfs:/tmp/foo.whl"], ["file:/tmp/foo.whl"]];
  notAllowedRequirements.forEach((requirements) => {
    it(`throws an error if the requirements include a not allowed scheme (requirements=${JSON.stringify(
      requirements
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
      requirement
    )})`, () => {
      expect(
        validateRequirements([
          requirement,
          "streamlit-xxx",
          "xxx-streamlit",
          "numpy",
        ])
      ).toEqual(["streamlit-xxx", "xxx-streamlit", "numpy"]);
    });
  });
});
