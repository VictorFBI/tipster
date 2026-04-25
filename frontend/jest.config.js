/** @type {import('jest').Config} */
module.exports = {
  preset: "react-native",
  transform: {
    "\\.[jt]sx?$": [
      "babel-jest",
      {
        caller: { name: "metro", bundler: "metro", platform: "ios" },
        configFile: "./babel.config.js",
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|native-base|react-native-svg|tamagui|@tamagui/.*|zustand|i18next|react-i18next|axios|@tanstack/.*)",
  ],
  setupFiles: ["./jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.(ts|tsx|js)", "**/*.(test|spec).(ts|tsx|js)"],
  testPathIgnorePatterns: ["/node_modules/", "/.storybook/", "/.rnstorybook/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.stories.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    // Исключить визуальные компоненты и инфраструктурный код из покрытия
    "!src/core/**/*.{ts,tsx}",
    "!src/screens/**/*.{ts,tsx}",
    "!src/modules/**/components/**/*.{ts,tsx}",
    "!src/shared/components/**/*.{ts,tsx}",
    "!src/shared/ui/**/*.{ts,tsx}",
    "!src/shared/storybook/**/*.{ts,tsx}",
    "!src/app/**/*.{ts,tsx}",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  watchman: false,
};
