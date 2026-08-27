import { css, SerializedStyles } from "@emotion/react";
import type { EmotionTheme } from "@streamlit/lib";

/**
 * Streamlit's PortalProvider mounts its overlay hosts (the data grid overlay
 * and the `@floating-ui/react` host) directly on `document.body`, so they sit
 * outside the `stlite-root` element that carries our text styles. Standard
 * Streamlit sets those styles on `body`, so its portals inherit them; stlite
 * scopes them to the root instead (via appStyles) so an embedding page is left
 * alone. Restate the inheritable text styles on the portal hosts so overlay
 * content matches the app.
 *
 * Keep these in sync with the inheritable text styles in appStyles.ts.
 */
export const overlayPortalStyles = (
  theme: EmotionTheme,
): SerializedStyles => css`
  [data-st-overlay-root="true"] {
    font-family: ${theme.genericFonts.bodyFont};
    font-size: ${theme.fontSizes.baseFontSize}px;
    font-weight: ${theme.fontWeights.normal};
    line-height: ${theme.lineHeights.base};
    color: ${theme.colors.bodyText};
  }
`;
