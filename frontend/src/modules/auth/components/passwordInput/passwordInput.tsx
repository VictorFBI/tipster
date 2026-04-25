import {
  Controller,
  Control,
  FieldError,
  RegisterOptions,
} from "react-hook-form";
import { YStack, Text, XStack } from "tamagui";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";
import { StyledInput } from "@/src/shared";
import { PasswordStrengthHint } from "../passwordStrengthHint/passwordStrengthHint";

interface PasswordInputProps {
  label: string;
  control: Control<any>;
  errors?: FieldError;
  message?: string;
  rules?: RegisterOptions;
  controlName?: string;
  showStrengthHint?: boolean;
}

export function PasswordInput({
  label,
  control,
  errors,
  message,
  rules,
  controlName = "password",
  showStrengthHint = false,
}: PasswordInputProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState("");

  const defaultRules = {
    required: t("auth.passwordRequired"),
    minLength: {
      value: 12,
      message: t("auth.passwordMinLength"),
    },
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <YStack gap="$2">
      <Text fontSize="$3" fontWeight="800" color="$text">
        {label}
      </Text>
      <Controller
        control={control}
        name={controlName}
        rules={rules || defaultRules}
        render={({ field: { onChange, onBlur, value } }) => (
          <>
            <XStack position="relative" alignItems="center">
              <StyledInput
                placeholder="••••••••"
                value={value}
                onChangeText={(text: string) => {
                  onChange(text);
                  if (showStrengthHint) {
                    setCurrentValue(text);
                  }
                }}
                onBlur={onBlur}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                hasError={!!errors}
                paddingRight="$10"
                inputSize="l"
                flex={1}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: 12,
                  padding: 8,
                }}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={currentTheme.muted}
                />
              </TouchableOpacity>
            </XStack>
            {showStrengthHint && (
              <PasswordStrengthHint password={currentValue} />
            )}
          </>
        )}
      />
      {errors && !showStrengthHint && (
        <Text fontSize="$2" color="$error">
          {message}
        </Text>
      )}
    </YStack>
  );
}
