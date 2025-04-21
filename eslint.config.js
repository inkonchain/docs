const simpleImportSort = require("eslint-plugin-simple-import-sort");
const path = require("node:path");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");

const baseDirectory = __dirname;
const compat = new FlatCompat({
  baseDirectory: baseDirectory,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = [
  // Default ignores - node_modules is ignored by default in recent ESLint, but good to be explicit.
  // Add other ignores if needed (e.g., build output directories like .next)
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/out/**"],
  },

  // Spread the configurations from extended configs
  ...compat.extends("next/core-web-vitals", "prettier"),

  // Configuration for JS/JSX/TS/TSX files
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      // Use the imported object directly as the key
      simpleImportSort: simpleImportSort,
    },
    rules: {
      "react-hooks/exhaustive-deps": "error",
      "import/newline-after-import": ["error", { count: 1 }],
      "simpleImportSort/imports": [
        "error",
        {
          groups: [
            ["^react", "^@?\\w"],
            ["^(@)(/.*|$)"],
            ["^\\u0000"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^.+\\.?(css)$"],
          ],
        },
      ],
      "simpleImportSort/exports": "error",
    },
  },
];
