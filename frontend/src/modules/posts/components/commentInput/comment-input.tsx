import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { XStack, Button, Input } from "tamagui";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

interface CommentInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

export function CommentInput({
  value,
  onChangeText,
  onSubmit,
}: CommentInputProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <XStack gap="$2" alignItems="center">
      <Input
        flex={1}
        placeholder={t("comments.addComment")}
        value={value}
        onChangeText={onChangeText}
        backgroundColor="$background"
        borderColor="$borderColor"
        borderWidth={1}
        borderRadius="$3"
        paddingHorizontal="$3"
        paddingVertical="$2"
        fontSize={14}
        color="$text"
        // @ts-ignore
        placeholderTextColor={currentTheme.muted}
      />
      <Button
        onPress={onSubmit}
        backgroundColor="$accent"
        borderRadius="$3"
        paddingHorizontal="$4"
        paddingVertical="$2"
        pressStyle={{ opacity: 0.8 }}
        disabled={!value.trim()}
        opacity={value.trim() ? 1 : 0.5}
      >
        <Ionicons name="send" size={18} color="white" />
      </Button>
    </XStack>
  );
}
