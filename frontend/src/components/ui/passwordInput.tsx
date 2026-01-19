import {
  Controller,
  Control,
  FieldError,
  RegisterOptions,
} from "react-hook-form";
import { YStack, Text, Input } from "tamagui";
import { useTranslation } from "react-i18next";

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

  const defaultRules = {
    required: t("auth.passwordRequired"),
    minLength: {
      value: 6,
      message: t("auth.passwordMinLength"),
    },
  };
  return (
    <YStack space="$2">
      <Text fontSize="$3" fontWeight="800" color="$text">
        {label}
      </Text>
      <Controller
        control={control}
        name={controlName}
        rules={rules || defaultRules}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="••••••••"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
            size="$5"
            backgroundColor="$background2"
            borderColor={errors ? "$error" : "$border"}
            color="$text"
            placeholderTextColor="$placeholder"
          />
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
