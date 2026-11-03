import { describe, expect, it } from "vitest";
import createCache from "@emotion/cache";
import { serializeStyles } from "@emotion/serialize";
import type { SerializedStyles } from "@emotion/react";
import type { EmotionTheme } from "@streamlit/lib";
// `@streamlit/lib` is aliased to an empty mock in tests, so import the source.
import { globalStyles as upstreamGlobalStyles } from "../../../streamlit/frontend/lib/src/theme/globalStyles";
import { appScopedStyles, appStyles } from "./appStyles";
import { documentStyles } from "./documentStyles";

// Distinct values, so a declaration that reads the wrong theme field shows up.
const theme = {
  fontSizes: { baseFontSize: 17 },
  genericFonts: { bodyFont: "body-font" },
  fontWeights: { normal: 401 },
  lineHeights: { base: 1.7 },
  colors: {
    bodyText: "#010101",
    bgColor: "#020202",
    black: "#030303",
    fadedText10: "#040404",
    fadedText40: "#050505",
  },
  radii: { full: "9999px" },
} as unknown as EmotionTheme;

const ROOT = ".stlite-root-test";

/** Compiles styles through Emotion, as `<Global>` would, into CSS rules. */
function compile(styles: SerializedStyles, selector = ""): string[] {
  const cache = createCache({ key: "test" });
  const rules: string[] = [];
  cache.sheet.insert = (rule: string) => rules.push(rule);
  cache.insert(selector, serializeStyles([styles]), cache.sheet, true);
  return rules;
}

/**
 * Flattens CSS rules into one "<at-rule> <selector> <property>:<value>" entry
 * per selector and declaration, so the comparison ignores grouping and order.
 */
function declarations(
  rules: string[],
  mapSelector: (selector: string) => string = (s) => s,
): string[] {
  const entries: string[] = [];
  const addRule = (atRule: string, rule: string) => {
    const open = rule.indexOf("{");
    const selectors = rule.slice(0, open).split(",");
    const decls = rule
      .slice(open + 1, -1)
      .split(";")
      .filter(Boolean);
    for (const selector of selectors) {
      for (const decl of decls) {
        entries.push(`${atRule} ${mapSelector(selector)} ${decl}`.trim());
      }
    }
  };
  for (const rule of rules) {
    if (!rule.startsWith("@")) {
      addRule("", rule);
      continue;
    }
    const open = rule.indexOf("{");
    const atRule = rule.slice(0, open);
    const body = rule.slice(open + 1, -1);
    const inner = body.match(/[^{}]+\{[^{}]*\}/g);
    // Fail loudly rather than drop declarations this parser can't attribute,
    // such as those of @font-face or of an at-rule nested in another.
    if (!inner || body.includes("@")) {
      throw new Error(`Unsupported at-rule: ${rule}`);
    }
    for (const innerRule of inner) {
      addRule(atRule, innerRule);
    }
  }
  return entries.sort();
}

// Only these keep the root's class specificity; see appScopedStyles.
const ROOT_SPECIFIC_SELECTORS = ["*", "*::before", "*::after"];

function unscope(selector: string): string {
  const wherePrefix = `:where(${ROOT}) `;
  if (selector.startsWith(wherePrefix)) {
    return selector.slice(wherePrefix.length);
  }
  const rest = selector.slice(`${ROOT} `.length);
  if (
    selector.startsWith(`${ROOT} `) &&
    ROOT_SPECIFIC_SELECTORS.includes(rest)
  ) {
    return rest;
  }
  throw new Error(`Not scoped to the app root by :where(): ${selector}`);
}

describe("appStyles", () => {
  it("matches upstream's global styles apart from the listed differences", () => {
    const upstream = declarations(compile(upstreamGlobalStyles(theme)));
    const stlite = [
      // The root element takes the place of upstream's `body`.
      ...declarations(compile(appStyles(theme), ROOT), () => "body"),
      ...declarations(compile(appScopedStyles(theme, ROOT)), unscope),
      ...declarations(compile(documentStyles)),
    ].sort();

    expect({
      upstreamOnly: upstream.filter((entry) => !stlite.includes(entry)),
      stliteOnly: stlite.filter((entry) => !upstream.includes(entry)),
    }).toEqual({
      upstreamOnly: [
        // The host page, not the app, owns the document's overflow.
        "body.embedded overflow:hidden",
        "body.embedded:hover overflow:auto",
        // Moved onto the app root, so it doesn't resize the host page's rem.
        "html font-size:17px",
      ],
      stliteOnly: [
        // The other half of the html font-size move above.
        "body font-size:17px",
        // documentStyles makes the document fill the viewport with no margin.
        "body height:100%",
        "html height:100%",
        "html margin:0",
      ],
    });
  });
});
