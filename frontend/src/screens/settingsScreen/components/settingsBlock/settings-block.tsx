import { YStack } from "tamagui";
import { SettingSection } from "../settingSection/setting-section";

import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/src/core/store/themeStore";
import { LanguageSelector } from "../languageSelector/language-selector";
import { SettingItem } from "../settingItem/setting-item";

export function SettingsBlock() {
  const { t } = useTranslation();
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  return (
    <YStack
      backgroundColor={"$surface"}
      borderRadius="$4"
      padding="$4"
      gap="$4"
    >
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
