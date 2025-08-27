/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 100,
  arrowParens: "always",
  endOfLine: "lf",
  bracketSpacing: true,
  bracketSameLine: false,
  jsxSingleQuote: false,
  useTabs: false,
  quoteProps: "as-needed",
  overrides: [
    {
      files: ["*.md", "*.mdx"],
      options: {
        proseWrap: "preserve",
      },
    },
    {
      files: ["*.json", ".prettierrc*", ".eslintrc*"],
      options: {
        parser: "json",
      },
    },
    {
      files: ["*.yaml", "*.yml"],
      options: {
        parser: "yaml",
      },
    },
  ],
};
