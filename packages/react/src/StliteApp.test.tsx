import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { StliteKernel } from "@stlite/kernel";
import StliteApp from "./StliteApp";

vi.mock("./StliteThemedApp", async () => {
  const { useStliteKernel } = await import("@stlite/kernel/contexts");

  const MockThemedApp = ({
    streamlitExecutionStartedAt,
    styleNonce,
    disableDocumentStyles,
  }: {
    streamlitExecutionStartedAt: number;
    styleNonce?: string;
    disableDocumentStyles?: boolean;
  }) => {
    const kernel = useStliteKernel() as StliteKernel & { __testId?: string };
    return (
      <div
        data-testid="themed-app"
        data-kernel-id={kernel.__testId}
        data-started-at={streamlitExecutionStartedAt}
        {...(styleNonce !== undefined && { "data-style-nonce": styleNonce })}
        {...(disableDocumentStyles !== undefined && {
          "data-disable-document-styles": disableDocumentStyles,
        })}
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

  it("passes disableDocumentStyles prop through to StliteThemedApp", () => {
    const kernel = new EventTarget() as StliteKernel & { __testId?: string };
    kernel.__testId = "fake-kernel";

    render(<StliteApp kernel={kernel} disableDocumentStyles={true} />);

    const themedApp = screen.getByTestId("themed-app");
    expect(themedApp.getAttribute("data-disable-document-styles")).toBe("true");
  });

  it("passes disableDocumentStyles=false correctly to StliteThemedApp", () => {
    const kernel = new EventTarget() as StliteKernel & { __testId?: string };
    kernel.__testId = "fake-kernel";

    render(<StliteApp kernel={kernel} disableDocumentStyles={false} />);

    const themedApp = screen.getByTestId("themed-app");
    expect(themedApp.getAttribute("data-disable-document-styles")).toBe(
      "false",
    );
  });

  it("handles undefined styleNonce and disableDocumentStyles props", () => {
    const kernel = new EventTarget() as StliteKernel & { __testId?: string };
    kernel.__testId = "fake-kernel";

    render(<StliteApp kernel={kernel} />);

    const themedApp = screen.getByTestId("themed-app");
    expect(themedApp.getAttribute("data-style-nonce")).toBeNull();
    expect(themedApp.getAttribute("data-disable-document-styles")).toBeNull();
  });

  it("passes both styleNonce and disableDocumentStyles props together", () => {
    const kernel = new EventTarget() as StliteKernel & { __testId?: string };
    kernel.__testId = "fake-kernel";
    const testNonce = "combined-test-nonce";

    render(
      <StliteApp
        kernel={kernel}
        styleNonce={testNonce}
        disableDocumentStyles={true}
      />,
    );

    const themedApp = screen.getByTestId("themed-app");
    expect(themedApp.getAttribute("data-style-nonce")).toBe(testNonce);
    expect(themedApp.getAttribute("data-disable-document-styles")).toBe("true");
  });
});
