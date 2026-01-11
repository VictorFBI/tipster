import { tokens } from "@/tokens";
import { Ionicons } from "@expo/vector-icons";
import { XStack, YStack, Text } from "tamagui";

export function ReferalBlock({
  referralCode,
  totalReferrals,
  earnedFromReferrals,
  activeReferrals,
}) {
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
          Реферальная программа
        </Text>
      </XStack>

      <Text color="white" fontSize={14} opacity={0.9} lineHeight={20}>
        Приглашайте друзей и зарабатывайте больше токенов! Вы получаете бонусы
        за каждого приглашенного пользователя.
      </Text>

      <YStack
        backgroundColor="rgba(255,255,255,0.15)"
        borderRadius="$3"
        padding="$3"
        gap="$2"
      >
        <Text color="white" fontSize={13} opacity={0.8}>
          Ваш реферальный код
        </Text>
        <XStack justifyContent="space-between" alignItems="center">
          <Text color="white" fontSize={24} fontWeight="bold" letterSpacing={2}>
            {referralCode}
          </Text>
          <YStack
            backgroundColor="rgba(255,255,255,0.2)"
            borderRadius="$2"
            padding="$2"
            pressStyle={{ opacity: 0.7 }}
          >
            <Ionicons name="copy-outline" size={20} color="white" />
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
              Осталось
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
              Приглашено
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
            Заработано
          </Text>
          <Text color="white" fontSize={28} fontWeight="bold">
            {earnedFromReferrals}
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}
