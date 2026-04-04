import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // Запрет импортов не из публичных API (index.ts)
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/src/modules/*/components/*",
                "@/src/modules/*/ui/*",
                "@/src/modules/*/api/*",
                "@/src/modules/*/hooks/*",
                "@/src/modules/*/store/*",
                "@/src/modules/*/utils/*",
                "@/src/shared/components/*",
                "@/src/shared/ui/*",
                "@/src/core/store/*",
                "@/src/core/theme/*",
                "@/src/core/utils/*",
                "@/src/core/providers/*",
                "@/src/screens/*/components/*",
              ],
              message:
                "Импорты должны быть только из публичных API (index.ts файлов). Используйте @/src/modules/*, @/src/shared, @/src/core, @/src/screens вместо прямых путей к внутренним модулям.",
            },
          ],
        },
      ],
    },
  },
  {
    // Разрешаем внутренние импорты внутри самих модулей
    files: [
      "src/modules/*/components/**/*",
      "src/modules/*/ui/**/*",
      "src/modules/*/api/**/*",
      "src/modules/*/hooks/**/*",
      "src/modules/*/store/**/*",
      "src/modules/*/utils/**/*",
      "src/shared/components/**/*",
      "src/shared/ui/**/*",
      "src/core/**/*",
      "src/screens/*/components/**/*",
    ],
    rules: {
      "no-restricted-imports": "off",
    },
  },
  {
    // Разрешаем внутренние импорты в index.ts файлах
    files: ["**/index.ts", "**/index.tsx"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
];
