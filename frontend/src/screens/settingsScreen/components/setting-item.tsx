import { tokens } from "@/src/core/theme/tokens";
import { themes } from "@/src/core/theme/themes";
import { useTheme } from "@/src/core/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { XStack, YStack, Text, Switch } from "tamagui";

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function SettingItem({
  icon,
  title,
  description,
  checked,
  onCheckedChange,
}: SettingItemProps) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <XStack justifyContent="space-between" alignItems="center">
      <XStack gap="$3" alignItems="center" flex={1}>
        <Ionicons name={icon} size={24} color="#8E8E93" />
        <YStack flex={1}>
          <Text color="$text" fontSize={16}>
            {title}
          </Text>
          <Text color={tokens.color.darkSecondary} fontSize={13}>
            {description}
          </Text>
        </YStack>
      </XStack>
      <Switch
        size="$3"
        checked={checked}
        onCheckedChange={onCheckedChange}
        style={{
          backgroundColor: checked ? currentTheme.accent : currentTheme.border,
        }}
      >
        <Switch.Thumb backgroundColor="white" />
      </Switch>
    </XStack>
  );
}
