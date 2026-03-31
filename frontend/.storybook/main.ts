import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-native-web-vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const main: StorybookConfig = {
  stories: [
    "../components/**/*.stories.mdx",
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  ],

  addons: ["@storybook/addon-docs", "@chromatic-com/storybook"],

  framework: {
    name: "@storybook/react-native-web-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve ??= {};
    config.resolve.alias ??= {};

    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string>),
      "expo-router": path.resolve(__dirname, "./mocks/expo-router.ts"),
      "expo-status-bar": path.resolve(__dirname, "./mocks/expo-status-bar.ts"),
      // "@walletconnect/modal-react-native": path.resolve(
      //   __dirname,
      //   "./mocks/walletconnect-modal-react-native.ts",
      // ),
    };

    return config;
  },
};

export default main;
