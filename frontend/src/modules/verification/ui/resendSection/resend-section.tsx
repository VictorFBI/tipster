import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { YStack, XStack, Text, Button } from "tamagui";
import { useTranslation } from "react-i18next";

interface ResendSectionProps {
  resendText: string;
  resendButtonText: string;
  onResend: () => void;
}

export function ResendSection({
  resendText,
  resendButtonText,
  onResend,
}: ResendSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <YStack gap="$2" marginTop="$4">
        <Text fontSize="$3" color="$text" opacity={0.7} textAlign="center">
          {resendText}
        </Text>
        <Button
          size="$4"
          onPress={onResend}
          backgroundColor="transparent"
          pressStyle={{ opacity: 0.7 }}
        >
          <Text fontSize="$4" color="$accent" fontWeight="800">
            {resendButtonText}
          </Text>
        </Button>
      </YStack>

      <XStack
        justifyContent="center"
        alignItems="center"
        gap="$2"
        marginTop="$4"
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text fontSize="$3" color="$accent" fontWeight="800">
            {t("auth.back")}
          </Text>
        </TouchableOpacity>
      </XStack>
    </>
  );
}
