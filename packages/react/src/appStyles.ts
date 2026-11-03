// Based on streamlit/frontend/lib/src/theme/globalStyles.ts

import { css, SerializedStyles } from "@emotion/react";
import { transparentize } from "color2k";
import type { EmotionTheme } from "@streamlit/lib";

/**
 * Contains various styles that are applied to the app.
 *
 * Please only add styles here if they are truly app-wide. Putting styles to the
 * individual components should be strongly preferred.
 */
export const appStyles = (theme: EmotionTheme): SerializedStyles => css`
  // Override the base font-size value here.
  font-size: ${theme.fontSizes.baseFontSize}px;

  // Body
  //
  // 1. Remove the margin in all browsers.
  // 2. As a best practice, apply a default background-color.
  // 3. Prevent adjustments of font size after orientation changes in iOS.
  // 4. Change the default tap highlight to be completely transparent in iOS.

  margin: 0; // 1
  font-family: ${theme.genericFonts.bodyFont};
  font-weight: ${theme.fontWeights.normal};
  line-height: ${theme.lineHeights.base};
  color: ${theme.colors.bodyText};
  background-color: ${theme.colors.bgColor}; // 2
  -webkit-text-size-adjust: 100%; // 3
  -webkit-tap-highlight-color: ${transparentize(theme.colors.black, 1)}; // 4
  -webkit-font-smoothing: auto;
`;

/**
 * The element-level resets that upstream applies to the whole document,
 * scoped to the descendants of the elements matching `rootSelector`.
 *
 * Upstream's bare element selectors lose to a component's own class.
 * Nesting these under the app root's class would let them win instead,
 * and Emotion doesn't reliably expand `&` inside `:where()` in a selector list,
 * so these are global styles with the root wrapped in `:where()` explicitly.
 */
export const appScopedStyles = (
  theme: EmotionTheme,
  rootSelector: string,
): SerializedStyles => {
  const root = `:where(${rootSelector})`;
  return css`
    // Not wrapped in :where(), so a host page's element rule
    // such as div { box-sizing: content-box } can't break the app's layout.
    // A component's own class still wins, since these styles are inserted first.
    ${rootSelector} *,
    ${rootSelector} *::before,
    ${rootSelector} *::after {
      box-sizing: border-box;
    }

    // Future-proof rule: in browsers that support :focus-visible, suppress the focus outline
    // on elements that programmatically receive focus but wouldn't normally show a visible
    // focus outline. In general, this would mean that the outline is only applied if the
    // interaction that led to the element receiving programmatic focus was a keyboard interaction,
    // or the browser has somehow determined that the user is primarily a keyboard user and/or
    // wants focus outlines to always be presented.
    // See https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible
    // and https://developer.paciellogroup.com/blog/2018/03/focus-visible-and-backwards-compatibility/

    ${root} [tabindex="-1"]:focus:not(:focus-visible) {
      outline: 0 !important;
    }

    // Lists
    // Reset margins on paragraphs
    //
    // Similarly, the top margin on <p>s get reset. However, we also reset the
    // bottom margin to use rem units instead of em.
    ${root} p,
    ${root} ol,
    ${root} ul,
    ${root} dl {
      margin: 0 0 1rem 0;
      padding: 0;
      font-size: 1rem;
      font-weight: ${theme.fontWeights.normal};
    }

    ${root} ol ol,
    ${root} ul ul,
    ${root} ol ul,
    ${root} ul ol {
      margin-bottom: 0;
    }

    // And undo these styles for placeholder links/named anchors (without href).
    // It would be more straightforward to just use a[href] in previous block, but that
    // causes specificity issues in many other styles that are too complex to fix.
    // See https://github.com/twbs/bootstrap/issues/19402

    ${root} a:not([href]):not([class]) {
      &,
      &:hover {
        color: inherit;
        text-decoration: none;
      }
    }

    // Images and content

    ${root} img,
    ${root} svg {
      vertical-align: middle;
    }

    // 1. Remove the margin in Firefox and Safari

    ${root} input,
    ${root} button,
    ${root} select,
    ${root} optgroup,
    ${root} textarea {
      margin: 0; // 1
      font-family: inherit;
      line-height: inherit;
      font-size: inherit;
    }

    // Show the overflow in Edge

    ${root} button,
    ${root} input {
      overflow: visible;
    }

    // Set the cursor for all buttons or button-like elements
    ${root} button,
    ${root} [role="button"] {
      &:not(:disabled) {
        cursor: pointer;
      }
    }

    // 1. Prevent a WebKit bug where (2) destroys native audio and video
    //    controls in Android 4.
    // 2. Correct the inability to style clickable types in iOS and Safari.
    // 3. Opinionated: add "hand" cursor to non-disabled button elements.

    ${root} button,
    ${root} [type="button"], // 1
    ${root} [type="reset"],
    ${root} [type="submit"] {
      -webkit-appearance: button; // 2
    }

    // Hidden attribute
    //
    // Always hide an element with the hidden HTML attribute.

    ${root} [hidden] {
      display: none !important;
    }

    // Tell browser to render a thin scrollbar that only appears when the
    // container is hovered. (This is ignored in OSes that render overlay
    // scrollbars, which is exactly what we want.)
    @supports (scrollbar-color: transparent transparent) {
      ${root} * {
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
      }

      ${root} *:hover {
        scrollbar-color: ${theme.colors.fadedText40} transparent;
      }
    }

    // Safari doesn't support scrollbar colors so we style the scrollbar
    // using the old webkit-only properties.
    @supports not (scrollbar-color: transparent transparent) {
      ${root} ::-webkit-scrollbar {
        background: transparent;
        border-radius: ${theme.radii.full};
        height: 6px;
        width: 6px;
      }

      ${root} ::-webkit-scrollbar:active {
        background: ${theme.colors.fadedText10};
      }

      ${root} :hover::-webkit-scrollbar-thumb:vertical,
      ${root} :hover::-webkit-scrollbar-thumb:horizontal {
        background: ${theme.colors.fadedText40};
        border-radius: ${theme.radii.full};
      }
    }
  `;
};
