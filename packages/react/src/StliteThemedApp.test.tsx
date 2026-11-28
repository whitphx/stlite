import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import StliteThemedApp from "./StliteThemedApp";

const FONT_SOURCE_URL =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400..700&display=swap";

vi.mock("@streamlit/app/src/util/useThemeManager", () => ({
  useThemeManager: () => [
    { activeTheme: {} },
    [],
    { "font-sans": FONT_SOURCE_URL },
  ],
}));

vi.mock("@streamlit/app/src/App", () => ({
  __esModule: true,
  default: () => <div data-testid="app" />,
}));

vi.mock(
  "@streamlit/app/src/components/FontFaceDeclaration/FontFaceDeclaration",
  () => ({
    __esModule: true,
    default: () => null,
  }),
);

// The kernel's React helpers import the built @streamlit/connection package;
// the font face resolution itself is tested in @stlite/kernel.
vi.mock("@stlite/kernel/react", () => ({
  useStliteResolvedFontFaces: <T,>(fontFaces: T[]) => fontFaces,
}));

vi.mock("./StliteRootStyleProvider", () => ({
  RootStyleProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

vi.mock("@streamlit/lib", () => ({
  PortalProvider: ({ children }: { children: ReactNode }) => <>{children}</>,
  WindowDimensionsProvider: ({ children }: { children: ReactNode }) => (
    <>{children}</>
  ),
}));

describe("StliteThemedApp", () => {
  afterEach(() => {
    cleanup();
  });

  // https://github.com/whitphx/stlite/issues/2187
  it("renders theme font sources into the document head", async () => {
    render(<StliteThemedApp streamlitExecutionStartedAt={Date.now()} />);

    expect(screen.getByTestId("app")).toBeTruthy();

    await waitFor(() => {
      const link = document.head.querySelector<HTMLLinkElement>(
        'link[rel="stylesheet"]#font-sans',
      );
      expect(link?.getAttribute("href")).toBe(FONT_SOURCE_URL);
    });
  });
});
