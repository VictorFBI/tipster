import { Ionicons } from "@expo/vector-icons";
import { XStack, Text, useTheme, Theme } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function Header({
  balance,
  headerText,
}: {
  headerText: string;
  balance?: number;
}) {
  const insets = useSafeAreaInsets();

  return (
    <XStack
      backgroundColor="#0A0A0F"
      paddingHorizontal="$4"
      paddingVertical="$4"
      paddingTop={insets.top + 16} // Добавляем отступ сверху
      alignItems="center"
      justifyContent="space-between"
    >
      <Text fontSize={24} fontWeight="bold" color="white">
        {headerText}
      </Text>
      {balance && (
        <Theme name="accent">
          <XStack
            backgroundColor={"$background"}
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
        </Theme>
      )}
    </XStack>
  );
}
