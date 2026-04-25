import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "@/src/core/store/themeStore";
import { themes } from "@/src/core/theme/themes";

interface PasswordRule {
  key: string;
  label: string;
  test: (password: string) => boolean;
}

interface PasswordStrengthHintProps {
  password: string;
}

export function PasswordStrengthHint({ password }: PasswordStrengthHintProps) {
  const { t } = useTranslation();
  const { theme } = useThemeStore();
  const currentTheme = themes[theme];

  const rules: PasswordRule[] = [
    {
      key: "minLength",
      label: t("auth.passwordHint.minLength"),
      test: (pw) => pw.length >= 12,
    },
    {
      key: "hasUppercase",
      label: t("auth.passwordHint.hasUppercase"),
      test: (pw) => /[A-Z]/.test(pw),
    },
    {
      key: "hasLowercase",
      label: t("auth.passwordHint.hasLowercase"),
      test: (pw) => /[a-z]/.test(pw),
    },
    {
      key: "hasNumber",
      label: t("auth.passwordHint.hasNumber"),
      test: (pw) => /[0-9]/.test(pw),
    },
    {
      key: "hasSpecial",
      label: t("auth.passwordHint.hasSpecial"),
      test: (pw) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(pw),
    },
  ];

  const passedCount = rules.filter((rule) => rule.test(password)).length;
  const totalCount = rules.length;

  const getStrengthColor = () => {
    if (passedCount <= 1) return currentTheme.error;
    if (passedCount <= 2) return currentTheme.warning;
    if (passedCount <= 3) return "#F59E0B";
    if (passedCount <= 4) return "#10B981";
    return "#10B981";
  };

  const getStrengthLabel = () => {
    if (password.length === 0) return "";
    if (passedCount <= 1) return t("auth.passwordHint.weak");
    if (passedCount <= 2) return t("auth.passwordHint.fair");
    if (passedCount <= 3) return t("auth.passwordHint.good");
    if (passedCount <= 4) return t("auth.passwordHint.strong");
    return t("auth.passwordHint.veryStrong");
  };

  if (password.length === 0) {
    return null;
  }

  return (
    <YStack gap="$1.5" paddingTop="$1">
      {/* Strength bar */}
      <XStack gap="$1" alignItems="center">
        {Array.from({ length: totalCount }).map((_, index) => (
          <YStack
            key={index}
            flex={1}
            height={3}
            borderRadius={2}
            backgroundColor={
              index < passedCount ? getStrengthColor() : currentTheme.border
            }
          />
        ))}
      </XStack>

      {/* Strength label */}
      <Text fontSize={11} color={getStrengthColor()} fontWeight="600">
        {getStrengthLabel()}
      </Text>

      {/* Rules checklist */}
      <YStack gap="$1">
        {rules.map((rule) => {
          const passed = rule.test(password);
          return (
            <XStack key={rule.key} alignItems="center" gap="$1.5">
              <Ionicons
                name={passed ? "checkmark-circle" : "ellipse-outline"}
                size={14}
                color={passed ? "#10B981" : currentTheme.muted}
              />
              <Text
                fontSize={12}
                color={passed ? "#10B981" : currentTheme.muted}
                opacity={passed ? 1 : 0.7}
              >
                {rule.label}
              </Text>
            </XStack>
          );
        })}
      </YStack>
    </YStack>
  );
}
