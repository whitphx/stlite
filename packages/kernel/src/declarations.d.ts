declare module "*.whl" {
  const res: string;
  export default res;
}

// Vite `?raw` imports (resolved by the consumer's Vite / vitest, which does the
// final bundling; tsc just passes the specifier through).
declare module "*?raw" {
  const content: string;
  export default content;
}
