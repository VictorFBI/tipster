import { Ionicons } from "@expo/vector-icons";
import { XStack, YStack } from "tamagui";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { StyledInput } from "@/src/shared";

export function SearchInput() {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <YStack paddingHorizontal="$4" paddingBottom="$4">
      <XStack
        backgroundColor={"$input"}
        borderRadius="$4"
        paddingHorizontal="$3"
        alignItems="center"
        gap="$2"
      >
        <Ionicons name="search" size={20} color={currentTheme.muted} />
        <StyledInput
          flex={1}
          backgroundColor="transparent"
          borderWidth={0}
          placeholder={t("search.placeholder")}
          // placeholderTextColor={currentTheme.muted}
          color={currentTheme.text}
          fontSize={16}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </XStack>
    </YStack>
  );
}
