import { tokens } from "@/tokens";
import { useState } from "react";
import { YStack } from "tamagui";
import { SettingSection } from "./setting-section";
import { SettingItem } from "./setting-item";
import { Divider } from "@/src/components/ui/divider";

export function SettingsBlock() {
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
      <SettingSection title="Уведомления">
        <SettingItem
          icon="notifications-outline"
          title="Push-уведомления"
          description="Получать уведомления о новой активности"
          checked={pushEnabled}
          onCheckedChange={setPushEnabled}
        />
      </SettingSection>

      <Divider />

      <SettingSection title="Приватность">
        <SettingItem
          icon="lock-closed-outline"
          title="Приватный аккаунт"
          description="Одобрение новых подписчиков"
          checked={privateAccount}
          onCheckedChange={setPrivateAccount}
        />
      </SettingSection>

      <Divider />

      <SettingSection title="Внешний вид">
        <SettingItem
          icon="moon-outline"
          title="Темная тема"
          description="Использовать темное оформление"
          checked={darkTheme}
          onCheckedChange={setDarkTheme}
        />
      </SettingSection>
    </YStack>
  );
}
