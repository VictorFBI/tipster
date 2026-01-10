import { YStack, Text } from "tamagui";

export default function ProfileScreen() {
  return (
    <YStack
      flex={1}
      backgroundColor="#0A0A0F"
      alignItems="center"
      justifyContent="center"
    >
      <Text fontSize={24} color="white">
        Профиль
      </Text>
      <Text fontSize={14} color="#8E8E93" marginTop="$2">
        Coming soon...
      </Text>
    </YStack>
  );
}
