import { Ionicons } from "@expo/vector-icons";
import { XStack, Text } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable } from "react-native";
import { useRouter } from "expo-router";

export function Header({
  balance,
  headerText,
  showBackButton,
}: {
  headerText: string;
  balance?: number;
  showBackButton?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <XStack
      backgroundColor={"$background"}
      paddingHorizontal="$4"
      paddingVertical="$4"
      paddingTop={insets.top + 16}
      alignItems="center"
      justifyContent="space-between"
    >
      <XStack alignItems="center" gap="$3" flex={1}>
        {showBackButton && (
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
        )}
        <Text fontSize={24} fontWeight="bold" color="$text">
          {headerText}
        </Text>
      </XStack>
      {balance && (
        <XStack
          backgroundColor={"$accent"}
          paddingHorizontal="$3"
          paddingVertical="$2"
          borderRadius="$10"
          alignItems="center"
          gap="$2"
        >
          <Ionicons name="diamond" size={16} color="white" />
          <Text fontSize={16} fontWeight="bold" color="white">
            {balance.toLocaleString()} TIP
          </Text>
        </XStack>
      )}
    </XStack>
  );
}
