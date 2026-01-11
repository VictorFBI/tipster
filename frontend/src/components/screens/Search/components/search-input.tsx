import { Ionicons } from "@expo/vector-icons";
import { XStack, YStack, Input } from "tamagui";
import { useState } from "react";

export function SearchInput() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <YStack paddingHorizontal="$4" paddingBottom="$4">
      <XStack
        backgroundColor="#1C1C23"
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
          placeholder="Найти пользователей..."
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
