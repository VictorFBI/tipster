import { Redirect } from "expo-router";
import { ENABLE_STORYBOOK } from "../config/storybook";

export default function Index() {
  // Redirect to Storybook if enabled, otherwise to login
  return <Redirect href={ENABLE_STORYBOOK ? "/storybook" : "/(auth)/login"} />;
}
