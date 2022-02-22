module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "import", "jest"],
  env: {
    node: true,
    "jest/globals": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:import/typescript",
  ],
  rules: {
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    // Disallow imports from infrastructure/ in src/services/
    // (see the "overrides" section for the exception)
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          {
            target: "./src/services",
            from: "./infrastructure",
          },
        ],
      },
    ],
  },
};
