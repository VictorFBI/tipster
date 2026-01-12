import { Ionicons } from "@expo/vector-icons";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import { Header } from "../../ui/header";
import { tokens } from "../../../theme/tokens";
import { BalanceBlock } from "./components/balance-block";
import { ReferalBlock } from "./components/referal-block";
import { SettingsBlock } from "./components/settings-block";
import { InfoBlock } from "../../ui/info-block";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { t } = useTranslation();
  const balance = 5420;

  const referralCode = "TIPSTER2026";
  const totalReferrals = 12;
  const activeReferrals = 8;
  const earnedFromReferrals = 600;

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

          <YStack
            backgroundColor="$surface"
            borderRadius="$4"
            padding="$4"
            alignItems="center"
            pressStyle={{ opacity: 0.8 }}
          >
            <XStack gap="$2" alignItems="center">
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text color="#EF4444" fontSize={16} fontWeight="600">
                {t("settings.logout")}
              </Text>
            </XStack>
          </YStack>

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
