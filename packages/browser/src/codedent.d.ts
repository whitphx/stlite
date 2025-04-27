// Type definitions for https://www.npmjs.com/package/codedent, https://github.com/WebReflection/codedent

declare module "codedent" {
  declare const codedent: (
    tpl: string | TemplateStringsArray,
    ...values: unknown[]
  ) => string;

  export default codedent;
}
