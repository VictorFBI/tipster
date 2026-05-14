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
import "@walletconnect/react-native-compat";
import {
  WalletConnectModal,
  useWalletConnectModal,
} from "@walletconnect/modal-react-native";
import { WalletAddressDialog } from "./wallet-address-dialog";

interface BalanceBlockProps {
  balance: number;
  isLoading?: boolean;
  isError?: boolean;
}

const projectId = "d67a278a81c58b1b3a5f99dcad1adef7";

/**
 * DEV TESTING: set to `true` to skip WalletConnect entirely and
 * immediately show the manual wallet address dialog. Set to `false`
 * for normal behavior (try WC first, fallback after 4s). Remove before release.
 */
const SIMULATE_WC_FAILURE = __DEV__ && false;

const WC_OPEN_TIMEOUT_MS = 4000;

const providerMetadata = {
  name: "Tipster",
  description: "Tipster wallet connection",
  url: "https://tipster.app",
  icons: ["https://tipster.app/icon.png"],
  redirect: {
    native: "tipster://",
    universal: "tipster://",
  },
};

function formatAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function BalanceBlock({
  balance,
  isLoading,
  isError,
}: BalanceBlockProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const navigation = useNavigation();

  const [isConnecting, setIsConnecting] = useState(false);
  const [showManualDialog, setShowManualDialog] = useState(false);

  const isFocusedRef = useRef(true);
  const isDisconnectingRef = useRef(false);
  const lastSyncedAddressRef = useRef<string | null>(null);
  const wcTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Whether the WC modal was opened during the current connect flow */
  const wcModalOpenedRef = useRef(false);
  /** Whether the user initiated a connect flow */
  const userInitiatedRef = useRef(false);
  /** Whether the sync mutation is in-flight (prevents duplicate calls) */
  const syncInFlightRef = useRef(false);

  const { isOpen, open, close, isConnected, address, provider } =
    useWalletConnectModal();

  const { data: myProfile } = useMyProfile({ enabled: true });

  const updateAccountProfileMutation = useUpdateAccountProfile({
    onError: () => {
      showAlert(t("common.error"), t("settings.walletAttachError"));
    },
  });

  // Keep a stable ref to the mutation so effects don't re-run when it changes
  const mutationRef = useRef(updateAccountProfileMutation);
  mutationRef.current = updateAccountProfileMutation;

  // Track screen focus to prevent modal from appearing on wrong screens
  useEffect(() => {
    const unsubFocus = navigation.addListener("focus", () => {
      isFocusedRef.current = true;
    });
    const unsubBlur = navigation.addListener("blur", () => {
      isFocusedRef.current = false;
      if (isConnecting) {
        close();
        setIsConnecting(false);
      }
    });
    return () => {
      unsubFocus();
      unsubBlur();
    };
  }, [navigation, close, isConnecting]);

  // When WC modal opens successfully, clear the fallback timeout
  // and reset connecting state
  useEffect(() => {
    if (!isOpen) return;

    // WC modal opened — cancel the fallback timer
    if (wcTimeoutRef.current) {
      clearTimeout(wcTimeoutRef.current);
      wcTimeoutRef.current = null;
    }

    // Mark that the modal was opened during this connect flow
    if (userInitiatedRef.current) {
      wcModalOpenedRef.current = true;
    }

    if (!isFocusedRef.current) {
      close();
      setIsConnecting(false);
      return;
    }

    if (isConnecting) {
      setIsConnecting(false);
    }
  }, [isOpen, isConnecting, close]);

  const walletAddress = myProfile?.walletAddress ?? null;

  useEffect(() => {
    if (
      isDisconnectingRef.current ||
      !userInitiatedRef.current ||
      !wcModalOpenedRef.current ||
      !isConnected ||
      !address ||
      lastSyncedAddressRef.current === address ||
      syncInFlightRef.current
    ) {
      return;
    }

    syncInFlightRef.current = true;

    mutationRef.current.mutate(
      { wallet_address: address },
      {
        onSuccess: () => {
          lastSyncedAddressRef.current = address;
          syncInFlightRef.current = false;
          // Reset the flow flags — connection is complete
          userInitiatedRef.current = false;
          wcModalOpenedRef.current = false;
        },
        onError: () => {
          syncInFlightRef.current = false;
        },
      },
    );
  }, [address, isConnected]);

  // Handle manual address submission (fallback flow)
  const handleManualConnect = useCallback(
    (manualAddress: string) => {
      if (lastSyncedAddressRef.current === manualAddress) {
        return;
      }

      updateAccountProfileMutation.mutate(
        { wallet_address: manualAddress },
        {
          onSuccess: () => {
            lastSyncedAddressRef.current = manualAddress;
          },
        },
      );
    },
    [updateAccountProfileMutation],
  );

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (wcTimeoutRef.current) {
        clearTimeout(wcTimeoutRef.current);
      }
    };
  }, []);

  const handleButtonPress = useCallback(async () => {
    if (walletAddress) {
      // Disconnect flow
      isDisconnectingRef.current = true;
      userInitiatedRef.current = false;
      wcModalOpenedRef.current = false;
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

    // DEV: skip WalletConnect entirely and show manual dialog
    if (SIMULATE_WC_FAILURE) {
      setShowManualDialog(true);
      return;
    }

    // Connect flow
    userInitiatedRef.current = true;
    wcModalOpenedRef.current = false;
    setIsConnecting(true);

    // Start a fallback timer — if WC modal doesn't open within the timeout,
    // show the manual address dialog instead
    wcTimeoutRef.current = setTimeout(() => {
      wcTimeoutRef.current = null;
      // Only fallback if the WC modal hasn't opened yet
      if (!isOpen) {
        try {
          close();
        } catch {
          // ignore close errors
        }
        setIsConnecting(false);
        userInitiatedRef.current = false;
        wcModalOpenedRef.current = false;
        setShowManualDialog(true);
      }
    }, WC_OPEN_TIMEOUT_MS);

    try {
      await open({ route: "ConnectWallet" });

      if (!isFocusedRef.current) {
        close();
      }
    } catch {
      // WC open failed — clear timeout and show manual dialog
      if (wcTimeoutRef.current) {
        clearTimeout(wcTimeoutRef.current);
        wcTimeoutRef.current = null;
      }
      userInitiatedRef.current = false;
      wcModalOpenedRef.current = false;
      setIsConnecting(false);
      setShowManualDialog(true);
    }
  }, [
    walletAddress,
    provider,
    open,
    close,
    updateAccountProfileMutation,
    isOpen,
  ]);

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
        ) : isError ? (
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

      <WalletAddressDialog
        open={showManualDialog}
        onOpenChange={setShowManualDialog}
        onConfirm={handleManualConnect}
      />
    </YStack>
  );
}
