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
    rules: {
      // Allow unused variables when they start with an underscore
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
      // Use unknown instead of any where possible
      "@typescript-eslint/no-explicit-any": "warn",
      // Ban using interface in favor of type alias
      "@typescript-eslint/consistent-type-definitions": ["error", "type"]
    }
  }
];

export default eslintConfig;
