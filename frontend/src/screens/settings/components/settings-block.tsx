import { useState } from "react";
import { YStack } from "tamagui";
import { SettingSection } from "./setting-section";
import { SettingItem } from "./setting-item";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/src/core/contexts/ThemeContext";
import { LanguageSelector } from "./language-selector";
import { Divider } from "@/src/shared/ui/divider";

export function SettingsBlock() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);

  return (
    <YStack
      backgroundColor={"$surface"}
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
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
          <LanguageSelector />
        </YStack>
      </SettingSection>
    </YStack>
  );
}
