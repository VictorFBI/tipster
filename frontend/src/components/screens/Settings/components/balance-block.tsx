import { Ionicons } from "@expo/vector-icons";
import { XStack, YStack, Text, Theme } from "tamagui";
import { useTranslation } from "react-i18next";
import { tokens } from "@/src/theme/tokens";

export function BalanceBlock({ balance }) {
  const { t } = useTranslation();

  return (
    <YStack
      borderRadius="$4"
      padding="$4"
      gap="$3"
      style={{
        background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
      }}
      backgroundColor="$accentColor"
    >
      <Text color="white" fontSize={16} fontWeight="500">
        {t("settings.tokenBalance")}
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
          <Text color={tokens.color.gray11} fontSize={16} fontWeight="600">
            {t("settings.connectWallet")}
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}
