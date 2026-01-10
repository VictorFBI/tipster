import { Ionicons } from "@expo/vector-icons";
import { XStack, Text, Theme } from "tamagui";

export function InfoBanner() {
  return (
    <Theme name="accent">
      <XStack
        backgroundColor="#3d286d6d"
        marginHorizontal="$4"
        marginTop="$4"
        padding="$3"
        borderRadius="$4"
        gap="$3"
        alignItems="flex-start"
      >
        <Ionicons name="bulb" size={20} color="#8B5CF6" />
        <Text fontSize={14} color="$color" flex={1} lineHeight={20}>
          Будьте активны! Каждый пост, лайк и комментарий увеличивает ваш
          airdrop
        </Text>
      </XStack>
    </Theme>
  );
}
