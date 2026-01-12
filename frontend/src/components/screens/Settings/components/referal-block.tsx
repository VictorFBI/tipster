import { tokens } from "@/src/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { XStack, YStack, Text } from "tamagui";
import { useTranslation } from "react-i18next";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { useState } from "react";

interface ReferalBlockProps {
  referralCode: string;
  totalReferrals: number;
  earnedFromReferrals: number;
  activeReferrals: number;
}

export function ReferalBlock({
  referralCode,
  totalReferrals,
  earnedFromReferrals,
  activeReferrals,
}: ReferalBlockProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await Clipboard.setStringAsync(referralCode);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <YStack
      backgroundColor={tokens.color.accent}
      borderRadius="$4"
      padding="$4"
      gap="$4"
    >
      <XStack gap="$2" alignItems="center">
        <Ionicons name="gift" size={24} color="white" />
        <Text color="white" fontSize={20} fontWeight="bold">
          {t("settings.referralProgram")}
        </Text>
      </XStack>

      <Text color="white" fontSize={14} opacity={0.9} lineHeight={20}>
        {t("settings.referralDescription")}
      </Text>

      <YStack
        backgroundColor="rgba(255,255,255,0.15)"
        borderRadius="$3"
        padding="$3"
        gap="$2"
      >
        <Text color="white" fontSize={13} opacity={0.8}>
          {t("settings.referralCode")}
        </Text>
        <XStack justifyContent="space-between" alignItems="center">
          <Text color="white" fontSize={24} fontWeight="bold" letterSpacing={2}>
            {referralCode}
          </Text>
          <YStack
            backgroundColor={
              copied ? "rgba(76,175,80,0.3)" : "rgba(255,255,255,0.2)"
            }
            borderRadius="$2"
            padding="$2"
            pressStyle={{ opacity: 0.7 }}
            onPress={handleCopyCode}
            cursor="pointer"
          >
            <Ionicons
              name={copied ? "checkmark-outline" : "copy-outline"}
              size={20}
              color="white"
            />
          </YStack>
        </XStack>
      </YStack>

      <XStack gap="$3">
        <YStack
          flex={1}
          backgroundColor="rgba(255,255,255,0.15)"
          borderRadius="$3"
          padding="$3"
          gap="$1"
        >
          <XStack gap="$1" alignItems="center">
            <Ionicons name="people" size={16} color="white" />
            <Text color="white" fontSize={12} opacity={0.8}>
              {t("settings.remaining")}
            </Text>
          </XStack>
          <Text color="white" fontSize={28} fontWeight="bold">
            {totalReferrals}
          </Text>
        </YStack>

        <YStack
          flex={1}
          backgroundColor="rgba(255,255,255,0.15)"
          borderRadius="$3"
          padding="$3"
          gap="$1"
        >
          <XStack gap="$1" alignItems="center">
            <Ionicons name="trending-up" size={16} color="white" />
            <Text color="white" fontSize={12} opacity={0.8}>
              {t("settings.invited")}
            </Text>
          </XStack>
          <Text color="white" fontSize={28} fontWeight="bold">
            {activeReferrals}
          </Text>
        </YStack>

        <YStack
          flex={1}
          backgroundColor="rgba(255,255,255,0.15)"
          borderRadius="$3"
          padding="$3"
          gap="$1"
        >
          <Text color="white" fontSize={12} opacity={0.8}>
            {t("settings.earned")}
          </Text>
          <Text color="white" fontSize={28} fontWeight="bold">
            {earnedFromReferrals}
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}
