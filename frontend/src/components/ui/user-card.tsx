import { XStack, YStack, Text } from "tamagui";
import { Image } from "react-native";

interface User {
  avatar: string;
  username: string;
  subscribers?: number;
}

export function UserCard({ user }: { user: User }) {
  return (
    <XStack alignItems="center" gap="$3" flex={1}>
      <Image
        source={{ uri: user.avatar }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
        }}
      />
      <YStack flex={1} gap="$1">
        <Text fontSize={18} fontWeight="600" color="white">
          {user.username}
        </Text>
        <XStack alignItems="center" gap="$3">
          <Text fontSize={14} color="#8E8E93">
            {(user.subscribers ?? 0).toLocaleString()} подписчиков
          </Text>
        </XStack>
      </YStack>
    </XStack>
  );
}
