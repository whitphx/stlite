import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { StliteKernel } from "@stlite/kernel";
import StliteApp from "./StliteApp";

vi.mock("@streamlit/app/src/ThemedApp", async () => {
  const { useStliteKernel } = await import("@stlite/kernel");

  const MockThemedApp = ({
    streamlitExecutionStartedAt,
  }: {
    streamlitExecutionStartedAt: number;
  }) => {
    const kernel = useStliteKernel() as StliteKernel & { __testId?: string };
    return (
      <div
        data-testid="themed-app"
        data-kernel-id={kernel.__testId}
        data-started-at={streamlitExecutionStartedAt}
      />
    );
  };

  return {
    __esModule: true,
    default: MockThemedApp,
  };
});

describe("StliteApp", () => {
  it("renders the Streamlit app with the provided kernel context", () => {
    const kernel = new EventTarget() as StliteKernel & { __testId?: string };
    kernel.__testId = "fake-kernel";

    render(<StliteApp kernel={kernel} />);

    const themedApp = screen.getByTestId("themed-app");
    expect(themedApp.getAttribute("data-kernel-id")).toBe("fake-kernel");

    const startedAt = Number(themedApp.getAttribute("data-started-at"));
    expect(Number.isNaN(startedAt)).toBe(false);
    expect(startedAt).toBeGreaterThan(0);
  });
});
