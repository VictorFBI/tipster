import React, { ReactNode, useMemo } from "react";

import { Text, Button, ButtonProps, SizeTokens } from "tamagui";

interface StyledButtonProps {
  onPress: () => void;
  disabled?: boolean;
  opacity?: number;
  text?: string;
  children?: ReactNode;
  buttonSize?: "s" | "m" | "l";
  color?: "accent" | "normal";
  borderRadius?: number;
}

const buttonSizes: Record<string, SizeTokens> = {
  s: "$3",
  m: "$4",
  l: "$5",
};

export function StyledButton({
  text,
  children,
  buttonSize = "m",
  disabled = false,
  opacity = 1,
  color = "accent",
  onPress,
  borderRadius = 12,
}: StyledButtonProps) {
  const content = useMemo(() => {
    if (children) {
      return children;
    }

    if (text) {
      return (
        <Text fontSize="$5" fontWeight="800" color="white">
          {text}
        </Text>
      );
    }

    return null;
  }, [children, text]);

  return (
    <Button
      onPress={onPress}
      size={buttonSizes[buttonSize]}
      marginTop={buttonSize === "s" ? "$1" : "$4"}
      disabled={disabled}
      opacity={disabled ? 0.5 : opacity}
      pressStyle={{ opacity: 0.8 }}
      backgroundColor={color === "accent" ? "$accent" : "$borderColor"}
      borderRadius={borderRadius}
    >
      {content}
    </Button>
  );
}
