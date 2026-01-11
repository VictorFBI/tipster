import { Avatar, YStack, Text, XStack, Theme } from "tamagui";

export function ProfileHeader() {
  return (
    <Theme name="accent">
      <YStack paddingVertical="$2" alignItems="center" gap="$3">
        <Avatar circular size="$10">
          <Avatar.Image src="https://i.pravatar.cc/150?img=12" />
          <Avatar.Fallback backgroundColor="#1C1C28" />
        </Avatar>

        <Text fontSize={20} fontWeight="600" color="white">
          @username
        </Text>

        <XStack
          backgroundColor="transparent"
          borderWidth={2}
          borderColor="$borderColor"
          paddingHorizontal="$3"
          paddingVertical="$1.5"
          borderRadius="$10"
        >
          <Text fontSize={14} fontWeight="600" color="$background">
            Создатель
          </Text>
        </XStack>

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
            <Text fontSize={20} fontWeight="700" color="white">
              28
            </Text>
            <Text fontSize={14} color="#8E8E93">
              Постов
            </Text>
          </YStack>
          <YStack alignItems="center" gap="$1">
            <Text fontSize={20} fontWeight="700" color="white">
              145
            </Text>
            <Text fontSize={14} color="#8E8E93">
              Подписчиков
            </Text>
          </YStack>
          <YStack alignItems="center" gap="$1">
            <Text fontSize={20} fontWeight="700" color="white">
              89
            </Text>
            <Text fontSize={14} color="#8E8E93">
              Подписок
            </Text>
          </YStack>
        </XStack>
      </YStack>
    </Theme>
  );
}
