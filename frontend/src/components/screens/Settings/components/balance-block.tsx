import { Ionicons } from "@expo/vector-icons";
import { XStack, YStack, Text, Theme } from "tamagui";

export function BalanceBlock({ balance }) {
  return (
    <Theme name="accent">
      <YStack
        borderRadius="$4"
        padding="$4"
        gap="$3"
        style={{
          background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
        }}
        backgroundColor="$background"
      >
        <Text color="white" fontSize={16} fontWeight="500">
          Баланс токенов
        </Text>

        <XStack alignItems="center" gap="$2">
          <Ionicons name="logo-bitcoin" size={32} color="white" />
          <Text color="white" fontSize={48} fontWeight="bold">
            {balance.toLocaleString()}
          </Text>
          <Text color="white" fontSize={24} fontWeight="500">
            TIP
          </Text>
        </XStack>

        <YStack
          backgroundColor="white"
          borderRadius="$3"
          padding="$3"
          alignItems="center"
          pressStyle={{ opacity: 0.9 }}
        >
          <XStack gap="$2" alignItems="center">
            <Ionicons name="wallet" size={20} color="#8B5CF6" />
            <Text color="$background" fontSize={16} fontWeight="600">
              Подключить кошелек
            </Text>
          </XStack>
        </YStack>
      </YStack>
    </Theme>
  );
}
