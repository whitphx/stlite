import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { StliteKernel } from "@stlite/kernel";
import StliteApp from "./StliteApp";

vi.mock("./StliteThemedApp", async () => {
  const { useStliteKernel } = await import("@stlite/kernel/contexts");

  const MockThemedApp = ({
    streamlitExecutionStartedAt,
    styleNonce,
    mountDocumentStyles,
  }: {
    streamlitExecutionStartedAt: number;
    styleNonce?: string;
    mountDocumentStyles?: boolean;
  }) => {
    const kernel = useStliteKernel() as StliteKernel & { __testId?: string };
    return (
      <div
        data-testid="themed-app"
        data-kernel-id={kernel.__testId}
        data-started-at={streamlitExecutionStartedAt}
        data-style-nonce={styleNonce}
        data-mount-document-styles={mountDocumentStyles}
      />
    );
  };

  return {
    __esModule: true,
    default: MockThemedApp,
  };
});

describe("StliteApp", () => {
  afterEach(() => {
    cleanup();
  });

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

  it("passes styleNonce prop through to StliteThemedApp", () => {
    const kernel = new EventTarget() as StliteKernel & { __testId?: string };
    kernel.__testId = "fake-kernel";
    const testNonce = "test-nonce-123";

    render(<StliteApp kernel={kernel} styleNonce={testNonce} />);

    const themedApp = screen.getByTestId("themed-app");
    expect(themedApp.getAttribute("data-style-nonce")).toBe(testNonce);
  });

  it("passes mountDocumentStyles prop through to StliteThemedApp", () => {
    const kernel = new EventTarget() as StliteKernel & { __testId?: string };
    kernel.__testId = "fake-kernel";

    render(<StliteApp kernel={kernel} mountDocumentStyles={true} />);

    const themedApp = screen.getByTestId("themed-app");
    expect(themedApp.getAttribute("data-mount-document-styles")).toBe("true");
  });

  it("passes mountDocumentStyles=false correctly to StliteThemedApp", () => {
    const kernel = new EventTarget() as StliteKernel & { __testId?: string };
    kernel.__testId = "fake-kernel";

    render(<StliteApp kernel={kernel} mountDocumentStyles={false} />);

    const themedApp = screen.getByTestId("themed-app");
    expect(themedApp.getAttribute("data-mount-document-styles")).toBe("false");
  });

  it("handles undefined styleNonce and mountDocumentStyles props", () => {
    const kernel = new EventTarget() as StliteKernel & { __testId?: string };
    kernel.__testId = "fake-kernel";

    render(<StliteApp kernel={kernel} />);

    const themedApp = screen.getByTestId("themed-app");
    expect(themedApp.getAttribute("data-style-nonce")).toBeNull();
    expect(themedApp.getAttribute("data-mount-document-styles")).toBeNull();
  });

  it("passes both styleNonce and mountDocumentStyles props together", () => {
    const kernel = new EventTarget() as StliteKernel & { __testId?: string };
    kernel.__testId = "fake-kernel";
    const testNonce = "combined-test-nonce";

    render(
      <StliteApp
        kernel={kernel}
        styleNonce={testNonce}
        mountDocumentStyles={true}
      />,
    );

    const themedApp = screen.getByTestId("themed-app");
    expect(themedApp.getAttribute("data-style-nonce")).toBe(testNonce);
    expect(themedApp.getAttribute("data-mount-document-styles")).toBe("true");
  });
});
