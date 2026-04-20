import { YStack, Text } from "tamagui";

interface VerificationIconProps {
  icon: string;
}

export function VerificationIcon({ icon }: VerificationIconProps) {
  return (
    <YStack alignItems="center">
      <YStack
        width={80}
        height={80}
        borderRadius={40}
        backgroundColor="$accent"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize={40}>{icon}</Text>
      </YStack>
    </YStack>
  );
}

//TODO DELETE
