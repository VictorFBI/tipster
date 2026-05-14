import { useState } from "react";
import { Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { YStack, XStack, Text, Button, Input } from "tamagui";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

interface WalletAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (address: string) => void;
}

const ETH_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;

export function WalletAddressDialog({
  open,
  onOpenChange,
  onConfirm,
}: WalletAddressDialogProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const [address, setAddress] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    const trimmed = address.trim();

    if (!trimmed) {
      setError(t("settings.walletAddressRequired"));
      return;
    }

    if (!ETH_ADDRESS_REGEX.test(trimmed)) {
      setError(t("settings.walletAddressInvalid"));
      return;
    }

    setError(null);
    setAddress("");
    onOpenChange(false);
    onConfirm(trimmed);
  };

  const handleCancel = () => {
    setError(null);
    setAddress("");
    onOpenChange(false);
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <TouchableOpacity
        style={overlayStyle}
        activeOpacity={1}
        onPress={handleCancel}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <YStack
            backgroundColor="$surface"
            padding="$5"
            borderRadius="$6"
            gap="$4"
            maxWidth={400}
            width="90%"
            shadowColor="$shadowColor"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={8}
            elevation={5}
          >
            <Text
              fontSize={20}
              fontWeight="600"
              color="$text"
              marginBottom="$1"
            >
              {t("settings.walletDialogTitle")}
            </Text>

            <Text fontSize={14} color="$textSecondary" lineHeight={20}>
              {t("settings.walletDialogDescription")}
            </Text>

            {/* VPN hint */}
            <XStack
              backgroundColor={currentTheme.accent + "15"}
              borderRadius="$3"
              padding="$3"
              gap="$2"
              alignItems="flex-start"
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={currentTheme.accent}
                style={{ marginTop: 1 }}
              />
              <Text
                fontSize={13}
                color="$textSecondary"
                lineHeight={18}
                flex={1}
              >
                {t("settings.walletVpnHint")}
              </Text>
            </XStack>

            <YStack gap="$2">
              <Input
                placeholder="0x..."
                value={address}
                onChangeText={(text) => {
                  setAddress(text);
                  if (error) setError(null);
                }}
                autoCapitalize="none"
                autoCorrect={false}
                backgroundColor="$background2"
                borderColor={error ? "$red10" : "$borderColor"}
                color="$text"
                placeholderTextColor="$placeholder"
                borderRadius={12}
                paddingHorizontal="$3"
                paddingVertical="$2"
                fontSize={14}
                borderWidth={1}
              />
              {error && (
                <Text fontSize={13} color="$red10">
                  {error}
                </Text>
              )}
            </YStack>

            <XStack gap="$3" marginTop="$2" justifyContent="flex-end">
              <Button
                onPress={handleCancel}
                backgroundColor="transparent"
                borderWidth={1}
                borderColor="$border"
                paddingHorizontal="$4"
                paddingVertical="$3"
                borderRadius="$3"
                pressStyle={{
                  opacity: 0.7,
                  backgroundColor: "$backgroundHover",
                }}
              >
                <Text fontSize={16} fontWeight="500" color="$text">
                  {t("common.cancel")}
                </Text>
              </Button>

              <Button
                onPress={handleConfirm}
                backgroundColor="$accent"
                borderWidth={0}
                paddingHorizontal="$4"
                paddingVertical="$3"
                borderRadius="$3"
                pressStyle={{
                  opacity: 0.8,
                }}
              >
                <Text fontSize={16} fontWeight="600" color="white">
                  {t("common.confirm")}
                </Text>
              </Button>
            </XStack>
          </YStack>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const overlayStyle = {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "center" as const,
  alignItems: "center" as const,
};
