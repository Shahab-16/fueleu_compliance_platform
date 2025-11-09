module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  env: { node: true, jest: true, es2021: true },
  rules: {
    "no-console": "off",
    "import/order": ["error", { "newlines-between": "always" }]
  }
};
