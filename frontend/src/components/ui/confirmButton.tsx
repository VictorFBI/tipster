import React from "react";

import { Text, Button } from "tamagui";

interface ConfirmButtonProps {
  onPress: () => void;
  disabled: boolean;
  opacity: number;
  text: string;
}

export function ConfirmButton({
  onPress,
  disabled,
  opacity,
  text,
}: ConfirmButtonProps) {
  return (
    <Button
      size="$5"
      marginTop="$4"
      onPress={onPress}
      disabled={disabled}
      opacity={opacity}
      pressStyle={{ opacity: 0.8 }}
      backgroundColor="$accent"
    >
      <Text fontSize="$5" fontWeight="800" color="white">
        {text}
      </Text>
    </Button>
  );
}
