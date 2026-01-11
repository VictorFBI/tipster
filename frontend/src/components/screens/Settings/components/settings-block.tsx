import { tokens } from "@/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { XStack, YStack, Text, Switch } from "tamagui";

export function SettingsBlock() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);

  return (
    <YStack
      backgroundColor={tokens.color.darkInput}
      borderRadius="$4"
      padding="$4"
      gap="$4"
    >
      {/* Notifications */}
      <YStack gap="$3">
        <Text color="white" fontSize={18} fontWeight="600">
          Уведомления
        </Text>

        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$3" alignItems="center" flex={1}>
            <Ionicons name="notifications-outline" size={24} color="#8E8E93" />
            <YStack flex={1}>
              <Text color="white" fontSize={16}>
                Push-уведомления
              </Text>
              <Text color={tokens.color.darkSecondary} fontSize={13}>
                Получать уведомления о новой активности
              </Text>
            </YStack>
          </XStack>
          <Switch
            size="$3"
            checked={pushEnabled}
            onCheckedChange={setPushEnabled}
            backgroundColor={
              pushEnabled ? tokens.color.accent : tokens.color.darkBorder
            }
          >
            <Switch.Thumb animation="quick" backgroundColor="white" />
          </Switch>
        </XStack>
      </YStack>

      <YStack height={1} backgroundColor={tokens.color.darkBorder} />

      {/* Privacy */}
      <YStack gap="$3">
        <Text color="white" fontSize={18} fontWeight="600">
          Приватность
        </Text>

        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$3" alignItems="center" flex={1}>
            <Ionicons name="lock-closed-outline" size={24} color="#8E8E93" />
            <YStack flex={1}>
              <Text color="white" fontSize={16}>
                Приватный аккаунт
              </Text>
              <Text color={tokens.color.darkSecondary} fontSize={13}>
                Одобрение новых подписчиков
              </Text>
            </YStack>
          </XStack>
          <Switch
            size="$3"
            checked={privateAccount}
            onCheckedChange={setPrivateAccount}
            backgroundColor={
              privateAccount ? tokens.color.accent : tokens.color.darkBorder
            }
          >
            <Switch.Thumb animation="quick" backgroundColor="white" />
          </Switch>
        </XStack>
      </YStack>

      <YStack height={1} backgroundColor={tokens.color.darkBorder} />

      {/* Appearance */}
      <YStack gap="$3">
        <Text color="white" fontSize={18} fontWeight="600">
          Внешний вид
        </Text>

        <XStack justifyContent="space-between" alignItems="center">
          <XStack gap="$3" alignItems="center" flex={1}>
            <Ionicons name="moon-outline" size={24} color="#8E8E93" />
            <YStack flex={1}>
              <Text color="white" fontSize={16}>
                Темная тема
              </Text>
              <Text color={tokens.color.darkSecondary} fontSize={13}>
                Использовать темное оформление
              </Text>
            </YStack>
          </XStack>
          <Switch
            size="$3"
            checked={darkTheme}
            onCheckedChange={setDarkTheme}
            backgroundColor={
              darkTheme ? tokens.color.accent : tokens.color.darkBorder
            }
          >
            <Switch.Thumb animation="quick" backgroundColor="white" />
          </Switch>
        </XStack>
      </YStack>
    </YStack>
  );
}
