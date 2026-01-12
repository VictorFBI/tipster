import { tokens } from "@/src/theme/tokens";
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
  return (
    <XStack justifyContent="space-between" alignItems="center">
      <XStack gap="$3" alignItems="center" flex={1}>
        <Ionicons name={icon} size={24} color="#8E8E93" />
        <YStack flex={1}>
          <Text color="$color" fontSize={16}>
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
        // backgroundColor={
        //   checked ? tokens.color.accent : tokens.color.darkBorder
        // }
        backgroundColor={checked ? "$accentColor" : "$borderColor"}
      >
        <Switch.Thumb animation="quick" backgroundColor="white" />
      </Switch>
    </XStack>
  );
}
