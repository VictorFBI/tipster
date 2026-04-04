import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { Avatar, YStack, Text } from "tamagui";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

interface AvatarPickerProps {
  avatar: string | null;
  onPress: () => void;
}

export function AvatarPicker({ avatar, onPress }: AvatarPickerProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <YStack alignItems="center" gap="$2">
      <TouchableOpacity onPress={onPress}>
        <Avatar circular size="$10" backgroundColor="$input">
          {avatar ? (
            <Avatar.Image src={avatar} />
          ) : (
            <Avatar.Fallback
              backgroundColor="$input"
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons
                name="person-outline"
                size={56}
                color={currentTheme.muted}
              />
            </Avatar.Fallback>
          )}
        </Avatar>
      </TouchableOpacity>
      <Text fontSize={14} color="$placeholder">
        {t("profile.filling.addAvatar")}
      </Text>
    </YStack>
  );
}
