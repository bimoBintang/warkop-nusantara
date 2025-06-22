import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Global rules
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-require-imports": "error"
    }
  },
  {
    // Ignore generated files and specific patterns
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "**/generated/**",
      "**/@prisma/**",
      "**/prisma/generated/**",
      "src/generated/**"
    ]
  },
  {
    // Override rules for generated files that might slip through
    files: [
      "**/generated/**/*.js",
      "**/generated/**/*.ts",
      "**/@prisma/**/*.js", 
      "**/@prisma/**/*.ts",
      "**/prisma/generated/**/*.js",
      "**/prisma/generated/**/*.ts"
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "off",
      "no-var": "off"
    }
  }
];

export default eslintConfig;