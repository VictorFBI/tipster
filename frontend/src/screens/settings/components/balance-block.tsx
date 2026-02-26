import { Ionicons } from "@expo/vector-icons";
import { XStack, YStack, Text } from "tamagui";
import { useTranslation } from "react-i18next";
import { tokens } from "@/src/core/theme/tokens";
import {
  WalletConnectModal,
  useWalletConnectModal,
} from "@walletconnect/modal-react-native";

interface BalanceBlockProps {
  balance: number;
}

const projectId = "d67a278a81c58b1b3a5f99dcad1adef7";

const providerMetadata = {
  name: "YOUR_PROJECT_NAME",
  description: "YOUR_PROJECT_DESCRIPTION",
  url: "https://your-project-website.com/",
  icons: ["https://your-project-logo.com/"],
  redirect: {
    native: "YOUR_APP_SCHEME://",
    universal: "YOUR_APP_UNIVERSAL_LINK.com",
  },
};

export function BalanceBlock({ balance }: BalanceBlockProps) {
  const { t } = useTranslation();

  const { open, isConnected, address, provider } = useWalletConnectModal();

  // Function to handle the
  const handleButtonPress = async () => {
    if (isConnected) {
      return provider?.disconnect();
    }
    console.log("toopne");
    return open();
  };

  // const handleWalletAction = async () => {
  //   console.log("=== BalanceBlock handleWalletAction ===");
  //   console.log("connect function:", typeof connect);
  //   try {
  //     await connect();
  //     console.log("connect() completed");
  //   } catch (error) {
  //     console.error("Error in handleWalletAction:", error);
  //   }
  // };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <YStack
      borderRadius="$4"
      padding="$4"
      gap="$3"
      style={{
        background: "linear-gradient(135deg, #F97316 0%, #FB923C 100%)",
      }}
      backgroundColor="$accent"
    >
      <Text color="white" fontSize={16} fontWeight="500">
        {t("settings.tokenBalance")}
      </Text>

      <WalletConnectModal
        explorerRecommendedWalletIds={[
          "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
        ]}
        explorerExcludedWalletIds={"ALL"}
        projectId={projectId}
        providerMetadata={providerMetadata}
      />

      <XStack alignItems="center" gap="$2">
        <Ionicons name="logo-bitcoin" size={32} color="white" />
        <Text color="white" fontSize={48} fontWeight="bold">
          {balance.toLocaleString()}
        </Text>
        <Text color="white" fontSize={24} fontWeight="500">
          TIP
        </Text>
      </XStack>

      {isConnected && address && (
        <XStack
          backgroundColor="rgba(255, 255, 255, 0.2)"
          borderRadius="$2"
          padding="$2"
          alignItems="center"
          gap="$2"
        >
          <Ionicons name="checkmark-circle" size={16} color="white" />
          <Text color="white" fontSize={14} fontWeight="500">
            {formatAddress(address)}
          </Text>
        </XStack>
      )}

      <YStack
        backgroundColor="white"
        borderRadius="$3"
        padding="$3"
        alignItems="center"
        pressStyle={{ opacity: 0.9 }}
        onPress={handleButtonPress}
        cursor="pointer"
      >
        <XStack gap="$2" alignItems="center">
          <Ionicons
            name={isConnected ? "wallet" : "wallet-outline"}
            size={20}
            color="#8B5CF6"
          />
          <Text color={tokens.color.gray11} fontSize={16} fontWeight="600">
            {isConnected
              ? t("settings.disconnectWallet")
              : t("settings.connectWallet")}
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}
