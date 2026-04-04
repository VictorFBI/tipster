import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { XStack, Button, Input } from "tamagui";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

interface ReplyInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function ReplyInput({
  value,
  onChangeText,
  onSubmit,
  onCancel,
}: ReplyInputProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <XStack gap="$2" alignItems="center" marginLeft="$6" marginTop="$2">
      <Input
        flex={1}
        placeholder={t("comments.writeReply")}
        value={value}
        onChangeText={onChangeText}
        backgroundColor="$background"
        borderColor="$borderColor"
        borderWidth={1}
        borderRadius="$3"
        paddingHorizontal="$3"
        paddingVertical="$2"
        fontSize={13}
        color="$text"
        // @ts-ignore
        placeholderTextColor={currentTheme.muted}
      />
      <Button
        onPress={onSubmit}
        backgroundColor="$accent"
        borderRadius="$3"
        paddingHorizontal="$3"
        paddingVertical="$2"
        pressStyle={{ opacity: 0.8 }}
        disabled={!value.trim()}
        opacity={value.trim() ? 1 : 0.5}
      >
        <Ionicons name="send" size={16} color="white" />
      </Button>
      <Button
        onPress={onCancel}
        backgroundColor="transparent"
        borderRadius="$3"
        paddingHorizontal="$3"
        paddingVertical="$2"
        pressStyle={{ opacity: 0.7 }}
      >
        <Ionicons name="close" size={16} color={currentTheme.muted} />
      </Button>
    </XStack>
  );
}
