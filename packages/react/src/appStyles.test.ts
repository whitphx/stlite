import { describe, expect, it } from "vitest";
import createCache from "@emotion/cache";
import { serializeStyles } from "@emotion/serialize";
import type { SerializedStyles } from "@emotion/react";
import type { EmotionTheme } from "@streamlit/lib";
// `@streamlit/lib` is aliased to an empty mock in tests, so import the source.
import { globalStyles as upstreamGlobalStyles } from "../../../streamlit/frontend/lib/src/theme/globalStyles";
import { appScopedStyles, appStyles } from "./appStyles";
import { documentStyles } from "./documentStyles";

/**
 * Throws on a field the stub lacks. Emotion drops a declaration whose value is
 * `undefined`, so an upstream addition reading a new field would vanish from
 * the comparison instead of failing it.
 */
function strict<T extends object>(value: T, path: string): T {
  return new Proxy(value, {
    get(target, key) {
      if (typeof key === "symbol") return Reflect.get(target, key);
      if (!(key in target)) {
        throw new Error(`The test theme has no ${path}.${key}; add it.`);
      }
      const field: unknown = Reflect.get(target, key);
      return typeof field === "object" && field !== null
        ? strict(field, `${path}.${key}`)
        : field;
    },
  });
}

// Distinct values, so a declaration that reads the wrong theme field shows up.
const theme = strict(
  {
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
  },
  "theme",
) as unknown as EmotionTheme;

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

const SCOPES = { where: `:where(${ROOT}) `, root: `${ROOT} ` };

function scopeOf(selector: string): keyof typeof SCOPES {
  for (const [scope, prefix] of Object.entries(SCOPES)) {
    if (selector.startsWith(prefix)) return scope as keyof typeof SCOPES;
  }
  throw new Error(`Not scoped to the app root: ${selector}`);
}

function unscope(selector: string): string {
  return selector.slice(SCOPES[scopeOf(selector)].length);
}

function only(mapping: Record<string, string>): (selector: string) => string {
  return (selector) => {
    if (!(selector in mapping)) {
      throw new Error(`Unexpected selector: ${selector}`);
    }
    return mapping[selector];
  };
}

describe("appStyles", () => {
  it("matches upstream's global styles apart from the listed differences", () => {
    const upstream = declarations(compile(upstreamGlobalStyles(theme)));
    const stlite = [
      // The root element takes the place of upstream's `body`.
      ...declarations(
        compile(appStyles(theme), ROOT),
        only({ [ROOT]: "body" }),
      ),
      ...declarations(compile(appScopedStyles(theme, ROOT)), unscope),
      // These style the host page's document, so they may touch nothing else.
      // The document's body gets its own label,
      // so its resets can't stand in for ones missing from the app root.
      ...declarations(
        compile(documentStyles),
        only({ html: "html", body: "document-body" }),
      ),
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
        "document-body height:100%",
        "document-body margin:0",
        "html height:100%",
        "html margin:0",
      ],
    });
  });

  // A widget's own class has to beat every reset but box-sizing;
  // see appScopedStyles.
  it("keeps only the box-sizing reset at the root's class specificity", () => {
    const rootSpecific = declarations(
      compile(appScopedStyles(theme, ROOT)),
      (selector) => `${scopeOf(selector)}:${unscope(selector)}`,
    ).filter((entry) =>
      entry.split(" ").some((part) => part.startsWith("root:")),
    );

    expect(rootSpecific).toEqual([
      "root:* box-sizing:border-box",
      "root:*::after box-sizing:border-box",
      "root:*::before box-sizing:border-box",
    ]);
  });
});
