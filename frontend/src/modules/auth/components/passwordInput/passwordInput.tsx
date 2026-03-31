import {
  Controller,
  Control,
  FieldError,
  RegisterOptions,
} from "react-hook-form";
import { YStack, Text, Input, XStack } from "tamagui";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

interface PasswordInputProps {
  label: string;
  control: Control<any>;
  errors?: FieldError;
  message?: string;
  rules?: RegisterOptions;
  controlName?: string;
}

export function PasswordInput({
  label,
  control,
  errors,
  message,
  rules,
  controlName = "password",
}: PasswordInputProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const defaultRules = {
    required: t("auth.passwordRequired"),
    minLength: {
      value: 6,
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
          <XStack position="relative" alignItems="center">
            <Input
              placeholder="••••••••"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry={!isPasswordVisible}
              size="$5"
              backgroundColor="$background2"
              borderColor={errors ? "$error" : "$border"}
              color="$text"
              placeholderTextColor="$placeholder"
              flex={1}
              paddingRight="$10"
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
        )}
      />
      {errors && (
        <Text fontSize="$2" color="$error">
          {message}
        </Text>
      )}
    </YStack>
  );
}
