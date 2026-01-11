import { XStack, Text, Theme, YStack } from "tamagui";

export function InfoBlock({
  text,
  icon,
  header,
  marginHorizontal = "$0",
}: {
  text: string;
  icon: React.ReactNode;
  header?: string;
  marginHorizontal?: string;
}) {
  return (
    <Theme name="accent">
      <YStack
        backgroundColor="rgba(139,92,246,0.1)"
        borderWidth={1}
        borderColor="$borderColor"
        borderRadius="$4"
        padding="$4"
        gap="$2"
        marginHorizontal={marginHorizontal}
      >
        {header ? (
          <>
            <XStack gap="$2" alignItems="center">
              {icon}
              <Text color="$background" fontSize={16} fontWeight="600">
                {header}
              </Text>
            </XStack>
            <Text color="$background" fontSize={13} lineHeight={18}>
              {text}
            </Text>
          </>
        ) : (
          <XStack gap="$2" alignItems="flex-start">
            {icon}
            <Text color="$background" fontSize={13} lineHeight={18} flex={1}>
              {text}
            </Text>
          </XStack>
        )}
      </YStack>
    </Theme>
  );
}
