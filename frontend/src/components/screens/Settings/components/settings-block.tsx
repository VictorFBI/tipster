import { tokens } from "@/tokens";
import { useState } from "react";
import { YStack } from "tamagui";
import { SettingSection } from "./setting-section";
import { SettingItem } from "./setting-item";
import { Divider } from "@/src/components/ui/divider";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/src/components/screens/Settings/components/language-selector";

export function SettingsBlock() {
  const { t } = useTranslation();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);

  return (
    <YStack
      backgroundColor={tokens.color.darkInput}
      borderRadius="$4"
      padding="$4"
      gap="$4"
    >
      <SettingSection title={t("settings.notifications")}>
        <SettingItem
          icon="notifications-outline"
          title={t("settings.pushNotifications")}
          description={t("settings.pushNotificationsDesc")}
          checked={pushEnabled}
          onCheckedChange={setPushEnabled}
        />
      </SettingSection>

      <Divider />

      <SettingSection title={t("settings.privacy")}>
        <SettingItem
          icon="lock-closed-outline"
          title={t("settings.privateAccount")}
          description={t("settings.privateAccountDesc")}
          checked={privateAccount}
          onCheckedChange={setPrivateAccount}
        />
      </SettingSection>

      <Divider />

      <SettingSection title={t("settings.appearance")}>
        <YStack gap="$5">
          <SettingItem
            icon="moon-outline"
            title={t("settings.darkTheme")}
            description={t("settings.darkThemeDesc")}
            checked={darkTheme}
            onCheckedChange={setDarkTheme}
          />
          <LanguageSelector />
        </YStack>
      </SettingSection>
    </YStack>
  );
}
