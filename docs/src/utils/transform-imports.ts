/**
 * Transform relative imports in demo files to package imports for documentation display.
 * This allows us to use tested demo code in docs while showing end-user imports.
 */

/**
 * Transform @stlite/react demo imports to published package imports.
 */
export function transformReactDemoImports(code: string): string {
  return (
    code
      // Transform: from "../../src/index" → from "@stlite/react"
      .replace(
        /from ["']\.\.\/\.\.\/src\/index["']/g,
        'from "@stlite/react"'
      )
      // Transform: from "../../src/vite-utils" → from "@stlite/react/vite-utils"
      .replace(
        /from ["']\.\.\/\.\.\/src\/vite-utils["']/g,
        'from "@stlite/react/vite-utils"'
      )
  );
}

/**
 * Transform @stlite/browser demo imports to published package imports.
 * (For future use when browser demos are added)
 */
export function transformBrowserDemoImports(code: string): string {
  return (
    code
      // Transform: from "../../src/index" → from "@stlite/browser"
      .replace(
        /from ["']\.\.\/\.\.\/src\/index["']/g,
        'from "@stlite/browser"'
      )
  );
}
