import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { XStack, YStack, Text, Spinner } from "tamagui";
import { useNavigation } from "@react-navigation/native";
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
  isLoading?: boolean;
  isError?: boolean;
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

export function BalanceBlock({
  balance,
  isLoading,
  isError,
}: BalanceBlockProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const [isConnecting, setIsConnecting] = useState(false);
  const navigation = useNavigation();
  // Ref that always reflects the current focus state (no re-render lag)
  const isFocusedRef = useRef(true);
  // Whether we initiated a wallet connect open from this component
  const pendingOpenRef = useRef(false);

  const { isOpen, open, close, isConnected, address, provider } =
    useWalletConnectModal();

  // Keep isFocusedRef in sync with navigation focus/blur events
  useEffect(() => {
    const unsubFocus = navigation.addListener("focus", () => {
      isFocusedRef.current = true;
    });
    const unsubBlur = navigation.addListener("blur", () => {
      isFocusedRef.current = false;
      // If the modal is already open when we lose focus, close it
      if (pendingOpenRef.current) {
        close();
        pendingOpenRef.current = false;
        setIsConnecting(false);
      }
    });
    return () => {
      unsubFocus();
      unsubBlur();
    };
  }, [navigation, close]);

  // When the modal opens, check if the screen is still focused.
  // If not, close it immediately before it becomes visible.
  useEffect(() => {
    if (isOpen && pendingOpenRef.current && !isFocusedRef.current) {
      close();
      pendingOpenRef.current = false;
      setIsConnecting(false);
      return;
    }
    if (isOpen && isConnecting) {
      setIsConnecting(false);
    }
  }, [isOpen, isConnecting, close]);

  // Reset pending flag when modal closes
  useEffect(() => {
    if (!isOpen) {
      pendingOpenRef.current = false;
    }
  }, [isOpen]);

  const { data: myProfile } = useMyProfile({ enabled: true });
  const lastSyncedAddressRef = useRef<string | null>(null);
  const isDisconnectingRef = useRef(false);

  // Set to true only when the user explicitly taps "Connect Wallet".
  // This distinguishes an intentional connection from a stale WalletConnect
  // session that was auto-restored from a previous user.
  const userInitiatedConnectRef = useRef(false);

  // Use the backend profile as the source of truth.
  // Fall back to the live WalletConnect address only when the user explicitly
  // initiated the connection in this session (not from a stale auto-restored session).
  const walletAddress =
    myProfile?.walletAddress ??
    (userInitiatedConnectRef.current && isConnected ? address : null) ??
    null;

  const updateAccountProfileMutation = useUpdateAccountProfile({
    onError: () => {
      showAlert(t("common.error"), "Failed to attach wallet");
    },
  });

  // Stable reference to the mutate function to avoid re-triggering the sync effect
  const mutateRef = useRef(updateAccountProfileMutation.mutate);
  mutateRef.current = updateAccountProfileMutation.mutate;

  // Sync wallet address to backend when a new address is connected.
  // Only sync if the user explicitly initiated the connection (not a stale session).
  useEffect(() => {
    if (
      isDisconnectingRef.current ||
      !userInitiatedConnectRef.current ||
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
    if (walletAddress) {
      // Set the flag before mutating to prevent the sync effect from
      // re-sending the old address while disconnect is in progress
      isDisconnectingRef.current = true;
      userInitiatedConnectRef.current = false;
      updateAccountProfileMutation.mutate(
        { wallet_address: null },
        {
          onSuccess: async () => {
            lastSyncedAddressRef.current = null;
            try {
              await provider?.disconnect();
            } catch {
              // WalletConnect may throw session-related errors on disconnect
            }
            isDisconnectingRef.current = false;
          },
          onError: () => {
            isDisconnectingRef.current = false;
          },
        },
      );
      return;
    }

    // Mark that the user explicitly initiated the wallet connection.
    // This flag prevents stale WalletConnect sessions (from a previous user)
    // from being treated as active connections.
    userInitiatedConnectRef.current = true;
    pendingOpenRef.current = true;
    setIsConnecting(true);
    try {
      // Await the open() promise — it resolves only when the WalletConnect SDK
      // is fully initialized and wallet data is loaded, so the modal will open
      // with content already visible (no blank dimmed screen).
      await open({ route: "ConnectWallet" });

      // After open() resolves, check if the screen is still focused.
      // If the user navigated away, close the modal immediately.
      if (!isFocusedRef.current) {
        close();
        pendingOpenRef.current = false;
      }
    } catch {
      // WalletConnect may throw internal errors during modal open
      userInitiatedConnectRef.current = false;
      pendingOpenRef.current = false;
    } finally {
      setIsConnecting(false);
    }
  }, [walletAddress, provider, open, close, updateAccountProfileMutation]);

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
        {isLoading ? (
          <Spinner size="large" color="white" />
        ) : isError || !isConnected ? (
          <Text color="white" fontSize={24} fontWeight="bold">
            —
          </Text>
        ) : (
          <Text color="white" fontSize={48} fontWeight="bold">
            {balance.toLocaleString()}
          </Text>
        )}
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
        pressStyle={isConnecting ? undefined : { opacity: 0.9 }}
        onPress={isConnecting ? undefined : handleButtonPress}
        cursor={isConnecting ? "default" : "pointer"}
        opacity={isConnecting ? 0.7 : 1}
      >
        <XStack gap="$2" alignItems="center">
          {isConnecting ? (
            <Spinner size="small" color={currentTheme.accent} />
          ) : (
            <Ionicons
              name={walletAddress ? "wallet" : "wallet-outline"}
              size={20}
              color={currentTheme.accent}
            />
          )}
          <Text color={currentTheme.tabActive} fontSize={16} fontWeight="600">
            {walletAddress
              ? t("settings.disconnectWallet")
              : t("settings.connectWallet")}
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
}
