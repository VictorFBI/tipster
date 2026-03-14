import { Ionicons } from "@expo/vector-icons";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import { TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "../../shared/components/header";
import { BalanceBlock } from "./components/balance-block";
import { ReferalBlock } from "./components/referal-block";
import { SettingsBlock } from "./components/settings-block";
import { InfoBlock } from "../../shared/components/info-block";
import { useTranslation } from "react-i18next";
import { tokens } from "@/src/core/theme/tokens";
import { useLogout } from "../../modules/auth/hooks";
import { useAuthStore } from "../../modules/auth/store/authStore";
import { STORAGE_KEYS } from "../../modules/auth/api/client";
import { getErrorMessage } from "../../core/utils";

export default function Settings() {
  const { t } = useTranslation();
  const router = useRouter();
  const logoutMutation = useLogout();
  const logout = useAuthStore((state) => state.logout);

  const balance = 5420;

  const referralCode = "TIPSTER2026";
  const totalReferrals = 12;
  const activeReferrals = 8;
  const earnedFromReferrals = 600;

  const handleLogout = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem(
        STORAGE_KEYS.REFRESH_TOKEN,
      );

      if (refreshToken) {
        await logoutMutation.mutateAsync({ refresh_token: refreshToken });
      }

      logout();
      router.replace("/(auth)/login");
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert(t("auth.error") || "Ошибка", errorMessage);
      console.error("Logout error:", error);
    }
  };

  return (
    <YStack flex={1} backgroundColor={"$background"}>
      <Header headerText={t("settings.title")} />

      <ScrollView>
        <YStack padding="$4" gap="$4">
          <BalanceBlock balance={balance} />

          <SettingsBlock />

          <ReferalBlock
            referralCode={referralCode}
            totalReferrals={totalReferrals}
            earnedFromReferrals={earnedFromReferrals}
            activeReferrals={activeReferrals}
          />

          <TouchableOpacity
            onPress={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <YStack
              backgroundColor="$surface"
              borderRadius="$4"
              padding="$4"
              alignItems="center"
              opacity={logoutMutation.isPending ? 0.5 : 1}
            >
              <XStack gap="$2" alignItems="center">
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text color="#EF4444" fontSize={16} fontWeight="600">
                  {logoutMutation.isPending
                    ? t("settings.loggingOut") || "Выход..."
                    : t("settings.logout")}
                </Text>
              </XStack>
            </YStack>
          </TouchableOpacity>

          <InfoBlock
            text={t("settings.securityInfo")}
            icon={
              <Ionicons
                name="shield-checkmark"
                size={20}
                color={tokens.color.accent}
              />
            }
            header={t("settings.security")}
          />
        </YStack>
      </ScrollView>
    </YStack>
  );
}
