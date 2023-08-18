module.exports = {
  singleQuote: false,
  trailingComma: "all",
  printWidth: 120,
  proseWrap: "always",
  endOfLine: "lf",
  overrides: [
    {
      files: ".prettierrc",
      options: {
        parser: "json",
      },
    },
  ],
};
