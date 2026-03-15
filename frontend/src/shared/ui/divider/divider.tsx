import { tokens } from "@/src/core/theme/tokens";
import { YStack } from "tamagui";

export function Divider() {
  return <YStack height={1} backgroundColor={tokens.color.darkBorder} />;
}
