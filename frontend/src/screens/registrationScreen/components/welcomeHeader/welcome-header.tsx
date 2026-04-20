import { YStack, Text } from "tamagui";
import { useTranslation } from "react-i18next";

export function WelcomeHeader() {
  const { t } = useTranslation();

  return (
    <YStack alignItems="center" gap="$1.5">
      <Text fontSize={24} fontWeight="700" color="$text" textAlign="center">
        {t("profile.filling.welcome")}
      </Text>
      <Text
        fontSize={14}
        color="$placeholder"
        textAlign="center"
        paddingHorizontal="$2"
      >
        {t("profile.filling.completeProfile")}
      </Text>
    </YStack>
  );
}
