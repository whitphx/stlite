import { css, SerializedStyles } from "@emotion/react";
import type { EmotionTheme } from "@streamlit/lib";

/**
 * Streamlit's PortalProvider mounts its overlay hosts (the data grid overlay
 * and the `@floating-ui/react` host) as direct children of `document.body`, so
 * they sit outside the `stlite-root` element that carries our text styles.
 * Standard Streamlit sets those styles on `body`, so its portals inherit them;
 * stlite scopes them to the root instead (via appStyles) so an embedding page
 * is left alone. Restate the inheritable text styles on the portal hosts so
 * overlay content matches the app.
 *
 * The `body >` qualifier matters: Streamlit marks the popover body with
 * `data-st-overlay-root` as well, and that one renders inside the
 * floating-overlay host, where it already inherits these styles.
 *
 * This stays mounted even under `disableDocumentStyles`, which is about
 * leaving the host page's `html` and `body` alone; these hosts are Streamlit's
 * own.
 *
 * Keep these in sync with the inheritable text styles in appStyles.ts.
 *
 * Known limitation: this is a document-global rule, so two stlite apps on one
 * page with different themes share whichever declaration lands last. Upstream's
 * portal hosts already use fixed DOM ids, so overlays are not per-instance
 * either way.
 */
export const overlayPortalStyles = (
  theme: EmotionTheme,
): SerializedStyles => css`
  body > [data-st-overlay-root="true"] {
    font-family: ${theme.genericFonts.bodyFont};
    font-size: ${theme.fontSizes.baseFontSize}px;
    font-weight: ${theme.fontWeights.normal};
    line-height: ${theme.lineHeights.base};
    color: ${theme.colors.bodyText};
  }
`;
