const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const {
  withStorybook,
} = require("@storybook/react-native/metro/withStorybook");

const storybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

// Configure Tamagui
defaultConfig.resolver.sourceExts.push("mjs");

// Игнорировать ошибки react-native-compat и отсутствующий .rnstorybook
defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native-compat") {
    return {
      type: "empty",
    };
  }

  // .rnstorybook is auto-generated and gitignored; resolve to empty when
  // storybook is disabled or the directory is missing (e.g. EAS build)
  if (!storybookEnabled && moduleName.includes(".rnstorybook")) {
    return {
      type: "empty",
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

const config = withStorybook(defaultConfig, {
  enabled: storybookEnabled,
});

module.exports = config;
