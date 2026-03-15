import React from "react";
import { YStack, Text, XStack } from "tamagui";

interface ErrorMessageProps {
  message?: string;
  visible?: boolean;
}

export function ErrorMessage({ message, visible = true }: ErrorMessageProps) {
  if (!visible || !message) {
    return null;
  }

  return (
    <YStack
      backgroundColor="$red2"
      borderColor="$red8"
      borderWidth={1}
      borderRadius="$4"
      padding="$3"
      gap="$2"
    >
      <XStack gap="$2" alignItems="flex-start">
        <YStack
          width={20}
          height={20}
          borderRadius={10}
          borderWidth={2}
          borderColor="$red10"
          alignItems="center"
          justifyContent="center"
          marginTop="$0.5"
        >
          <Text fontSize={12} color="$red10" fontWeight="bold">
            !
          </Text>
        </YStack>
        <Text
          fontSize="$3"
          fontWeight="500"
          color="$red11"
          flex={1}
          lineHeight={20}
        >
          {message}
        </Text>
      </XStack>
    </YStack>
  );
}
