import { Ionicons } from "@expo/vector-icons";
import { XStack, Text, useTheme, Theme, YStack, Input } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

//TODO
export function SearchInput() {
  return (
    <YStack paddingHorizontal="$4" paddingBottom="$4">
      <XStack
        backgroundColor="#1C1C23"
        borderRadius="$4"
        paddingHorizontal="$3"
        paddingVertical="$3"
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
