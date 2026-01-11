import { XStack, Text, Theme } from "tamagui";

export function InfoBlock({
  text,
  icon,
}: {
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <Theme name="accent">
      <XStack
        backgroundColor="#3d286d6d"
        marginHorizontal="$4"
        marginTop="$4"
        padding="$3"
        borderRadius="$4"
        gap="$3"
        alignItems="flex-start"
      >
        {icon}
        <Text fontSize={14} color="$color" flex={1} lineHeight={20}>
          {text}
        </Text>
      </XStack>
    </Theme>
  );
}
