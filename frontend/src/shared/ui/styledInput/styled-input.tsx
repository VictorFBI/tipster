import React from "react";
import { Input, SizeTokens } from "tamagui";

interface StyledInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  inputSize?: "s" | "m" | "l";
  hasError?: boolean;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoComplete?: string;
  flex?: number;
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
  borderRadius?: number;
  paddingHorizontal?: string | number;
  paddingVertical?: string | number;
  paddingRight?: string | number;
  fontSize?: number;
  borderWidth?: number;
}

const inputSizes: Record<string, SizeTokens> = {
  s: "$3",
  m: "$4",
  l: "$5",
};

export function StyledInput({
  placeholder,
  value,
  onChangeText,
  onBlur,
  inputSize = "m",
  hasError = false,
  disabled = false,
  secureTextEntry = false,
  keyboardType = "default",
  autoComplete,
  flex,
  backgroundColor = "$background2",
  borderColor = "$borderColor",
  color = "$text",
  borderRadius = 12,
  paddingHorizontal = "$3",
  paddingVertical = "$2",
  paddingRight,
  fontSize = 14,
  borderWidth = 1,
}: StyledInputProps) {
  const finalBorderColor = borderColor || (hasError ? "$error" : "$border");

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      onBlur={onBlur}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoComplete={autoComplete}
      disabled={disabled}
      size={inputSizes[inputSize]}
      flex={flex}
      backgroundColor={backgroundColor}
      borderColor={finalBorderColor}
      color={color}
      placeholderTextColor="$placeholder"
      borderRadius={borderRadius}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      paddingRight={paddingRight}
      fontSize={fontSize}
      borderWidth={borderWidth}
      opacity={disabled ? 0.5 : 1}
    />
  );
}
