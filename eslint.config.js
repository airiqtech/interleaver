import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import boundaries from "eslint-plugin-boundaries";

const sharedLanguageOptions = {
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "module",
  },
};

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.ts"],
    ignores: ["dist/**"],
    languageOptions: sharedLanguageOptions,
    plugins: {
      import: importPlugin,
      boundaries,
    },
    settings: {
      "boundaries/elements": [
        { type: "module", pattern: "src/modules/*" },
        { type: "client", pattern: "src/clients/*" },
        { type: "core", pattern: "src/core/*" },
        { type: "plugin", pattern: "src/plugins/*" },
        { type: "middleware", pattern: "src/middlewares/*" },
        { type: "util", pattern: "src/utils/*" },
      ],
    },
    rules: {
      /**
       * Architecture guards:
       * - Modules cannot depend on other modules; they may use shared layers only.
       * - Clients should stay thin and rely on core/utils.
       */
      "boundaries/element-types": [
        "error",
        {
          default: "allow",
          overrides: [
            {
              from: ["module"],
              allow: ["client", "core", "plugin", "middleware", "util"],
              message:
                "Modules must not import other modules; depend on shared layers instead.",
            },
            {
              from: ["client"],
              allow: ["core", "util"],
              message:
                "Clients should only depend on core and utils to stay lean.",
            },
          ],
        },
      ],
      /**
       * Prevent direct HTTP calls outside dedicated clients.
       * Enforce fetch/axios usage only inside src/clients.
       */
      "no-restricted-globals": [
        "error",
        {
          name: "fetch",
          message: "Use a typed client in src/clients for outbound HTTP calls.",
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["axios", "node-fetch", "cross-fetch"],
              message:
                "HTTP libraries are only allowed inside src/clients. Add or reuse a client there.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["src/clients/**/*.ts"],
    ignores: ["dist/**"],
    languageOptions: sharedLanguageOptions,
    rules: {
      // Allow HTTP usage inside clients.
      "no-restricted-globals": "off",
      "no-restricted-imports": "off",
    },
  },
];
