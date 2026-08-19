import js from "@eslint/js";
import ts from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default ts.config(
  {
    ignores: [
      "dist/",
      ".astro/",
      "node_modules/",
      "playwright-report/",
      "test-results/",
      ".lighthouseci/",
      "public/hero/",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ["**/*.astro"],
    rules: {
      // Astro's compiler emits `any` for frontmatter props it cannot narrow.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    // Node-only build scripts and config — not browser code.
    files: ["scripts/**/*.mjs", "*.config.{js,mjs,ts}", "tests/**/*.ts"],
    languageOptions: {
      globals: {
        process: "readonly",
        console: "readonly",
        URL: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        setTimeout: "readonly",
      },
    },
  },
);
