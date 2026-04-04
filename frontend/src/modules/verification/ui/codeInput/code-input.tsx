import React from "react";
import { TextInput } from "react-native";
import { YStack, XStack, Text } from "tamagui";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

interface CodeInputProps {
  code: string[];
  error: string;
  label: string;
  inputRefs: React.MutableRefObject<(TextInput | null)[]>;
  onCodeChange: (value: string, index: number) => void;
  onKeyPress: (e: any, index: number) => void;
}

export function CodeInput({
  code,
  error,
  label,
  inputRefs,
  onCodeChange,
  onKeyPress,
}: CodeInputProps) {
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  return (
    <>
      <Text fontSize="$3" fontWeight="800" color="$text" textAlign="center">
        {label}
      </Text>

      <XStack justifyContent="center" gap="$3">
        {code.map((digit, index) => (
          <YStack
            key={index}
            width={50}
            height={60}
            borderRadius="$4"
            borderWidth={2}
            borderColor={error ? "$error" : digit ? "$accent" : "$border"}
            backgroundColor="$background2"
            alignItems="center"
            justifyContent="center"
          >
            <TextInput
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              value={digit}
              onChangeText={(value) => onCodeChange(value, index)}
              onKeyPress={(e) => onKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              style={{
                fontSize: 24,
                fontWeight: "bold",
                textAlign: "center",
                width: "100%",
                height: "100%",
                color: currentTheme.text,
              }}
            />
          </YStack>
        ))}
      </XStack>

      {error && (
        <Text fontSize="$3" color="$error" textAlign="center">
          {error}
        </Text>
      )}
    </>
  );
}
