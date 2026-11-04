const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");
const prettier = require("eslint-config-prettier");
const simpleImportSort = require("eslint-plugin-simple-import-sort");

module.exports = [
  // Default ignores - node_modules is ignored by default in recent ESLint, but good to be explicit.
  // Add other ignores if needed (e.g., build output directories like .next)
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/out/**"],
  },

  // eslint-config-next@16 ships native flat configs, so they can be spread
  // directly instead of going through FlatCompat.
  ...nextCoreWebVitals,
  prettier,

  // Configuration for JS/JSX/TS/TSX files
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    plugins: {
      // Use the imported object directly as the key
      simpleImportSort: simpleImportSort,
    },
    rules: {
      "react-hooks/exhaustive-deps": "error",
      // React Compiler-derived rules added to `recommended` in
      // eslint-plugin-react-hooks 7 (via eslint-config-next 16). Kept as
      // warnings for now so the Next 16 upgrade doesn't fail lint on
      // pre-existing component patterns; fix the call sites and promote to
      // "error" when convenient.
      "react-hooks/immutability": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
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
