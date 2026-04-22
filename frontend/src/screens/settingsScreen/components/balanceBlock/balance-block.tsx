import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { XStack, YStack, Text } from "tamagui";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { showAlert } from "@/src/core/utils/alertService";
import {
  useMyProfile,
  useUpdateAccountProfile,
} from "@/src/modules/user/hooks/useUser";
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
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const { open, isConnected, address, provider } = useWalletConnectModal();
  const { data: myProfile } = useMyProfile({ enabled: true });
  const lastSyncedAddressRef = useRef<string | null>(null);
  const isDisconnectingRef = useRef(false);
  const walletAddress = address ?? myProfile?.walletAddress ?? null;

  const updateAccountProfileMutation = useUpdateAccountProfile({
    onError: () => {
      showAlert(t("common.error"), "Failed to attach wallet");
    },
  });

  // Stable reference to the mutate function to avoid re-triggering the sync effect
  const mutateRef = useRef(updateAccountProfileMutation.mutate);
  mutateRef.current = updateAccountProfileMutation.mutate;

  // Sync wallet address to backend when a new address is connected
  useEffect(() => {
    if (
      isDisconnectingRef.current ||
      !isConnected ||
      !address ||
      lastSyncedAddressRef.current === address
    ) {
      return;
    }

    mutateRef.current(
      { wallet_address: address },
      {
        onSuccess: () => {
          lastSyncedAddressRef.current = address;
        },
      },
    );
  }, [address, isConnected]);

  const handleButtonPress = useCallback(async () => {
    if (isConnected) {
      // Set the flag before mutating to prevent the sync effect from
      // re-sending the old address while disconnect is in progress
      isDisconnectingRef.current = true;
      updateAccountProfileMutation.mutate(
        { wallet_address: null },
        {
          onSuccess: async () => {
            lastSyncedAddressRef.current = null;
            await provider?.disconnect();
            isDisconnectingRef.current = false;
          },
          onError: () => {
            isDisconnectingRef.current = false;
          },
        },
      );
      return;
    }

    return open();
  }, [isConnected, provider, open, updateAccountProfileMutation]);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <YStack borderRadius="$4" padding="$4" gap="$3" backgroundColor="$accent">
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

      {walletAddress && (
        <XStack
          backgroundColor="rgba(255, 255, 255, 0.2)"
          borderRadius="$2"
          padding="$2"
          alignItems="center"
          gap="$2"
        >
          <Ionicons name="checkmark-circle" size={16} color="white" />
          <Text color="white" fontSize={14} fontWeight="500">
            {formatAddress(walletAddress)}
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
            color={currentTheme.accent}
          />
          <Text color={currentTheme.tabActive} fontSize={16} fontWeight="600">
            {isConnected
              ? t("settings.disconnectWallet")
              : t("settings.connectWallet")}
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}
