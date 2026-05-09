import React from "react";
import { Text, View } from "react-native";

// .rnstorybook is auto-generated and gitignored.
// When storybook is disabled, metro.config.js resolves this to an empty module,
// so StorybookUI will be undefined.
const StorybookUI = require("../../.rnstorybook").default;

export default function Storybook() {
  if (StorybookUI) {
    return <StorybookUI />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Storybook is not available in this build.</Text>
    </View>
  );
}
