import { Ionicons } from "@expo/vector-icons";
import { XStack, YStack, Input } from "tamagui";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function SearchInput() {
  const { t } = useTranslation();
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
        <Ionicons name="search" size={20} color="#8E8E93" />
        <Input
          flex={1}
          backgroundColor="transparent"
          borderWidth={0}
          placeholder={t("search.placeholder")}
          placeholderTextColor="#8E8E93"
          color="white"
          fontSize={16}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </XStack>
    </YStack>
  );
}
