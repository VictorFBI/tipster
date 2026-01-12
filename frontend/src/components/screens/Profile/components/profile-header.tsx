import { Avatar, YStack, Text, XStack } from "tamagui";

export function ProfileHeader() {
  return (
    <YStack paddingVertical="$2" alignItems="center" gap="$3">
      <Avatar circular size="$10">
        <Avatar.Image src="https://i.pravatar.cc/150?img=12" />
        <Avatar.Fallback backgroundColor="#1C1C28" />
      </Avatar>

      <YStack alignItems="center" gap="$1">
        <Text fontSize={20} fontWeight="600" color="$text">
          Павел Дуров
        </Text>

        <Text fontSize={15} fontWeight="600" color="$text">
          @username
        </Text>
      </YStack>

      <Text
        fontSize={14}
        color="#8E8E93"
        textAlign="center"
        paddingHorizontal="$6"
        lineHeight={20}
      >
        Активный участник Tipster. Заработал свой первый airdrop! 🚀
      </Text>

      <XStack gap="$8" marginTop="$2">
        <YStack alignItems="center" gap="$1">
          <Text fontSize={20} fontWeight="700" color="$text">
            28
          </Text>
          <Text fontSize={14} color="#8E8E93">
            Постов
          </Text>
        </YStack>
        <YStack alignItems="center" gap="$1">
          <Text fontSize={20} fontWeight="700" color="$text">
            145
          </Text>
          <Text fontSize={14} color="#8E8E93">
            Подписчиков
          </Text>
        </YStack>
        <YStack alignItems="center" gap="$1">
          <Text fontSize={20} fontWeight="700" color="$text">
            89
          </Text>
          <Text fontSize={14} color="#8E8E93">
            Подписок
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
}
