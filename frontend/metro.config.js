const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const {
  withStorybook,
} = require("@storybook/react-native/metro/withStorybook");

// Configure Tamagui
defaultConfig.resolver.sourceExts.push("mjs");

// Игнорировать ошибки react-native-compat
defaultConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "react-native-compat") {
    return {
      type: "empty",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

const config = withStorybook(defaultConfig, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true",
});

module.exports = config;
