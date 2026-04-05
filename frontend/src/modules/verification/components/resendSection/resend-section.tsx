import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { YStack, XStack, Text, Button } from "tamagui";
import { useTranslation } from "react-i18next";

interface ResendSectionProps {
  resendText: string;
  resendButtonText: string;
  onResend: () => void;
  resendTimer?: number;
}

export function ResendSection({
  resendText,
  resendButtonText,
  onResend,
  resendTimer = 0,
}: ResendSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();

  const isDisabled = resendTimer > 0;
  const buttonText = isDisabled
    ? `${resendButtonText} (${resendTimer}${t("auth.seconds")})`
    : resendButtonText;

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
          disabled={isDisabled}
          opacity={isDisabled ? 0.5 : 1}
        >
          <Text
            fontSize="$4"
            color="$accent"
            fontWeight="800"
            opacity={isDisabled ? 0.5 : 1}
          >
            {buttonText}
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
