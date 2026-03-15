import { Controller, Control, FieldError } from "react-hook-form";
import { YStack, Text, Input } from "tamagui";
import { useTranslation } from "react-i18next";

interface EmailInputProps {
  control: Control<any>;
  errors?: FieldError;
  message?: string;
}

export function EmailInput({ control, errors, message }: EmailInputProps) {
  const { t } = useTranslation();
  return (
    <YStack gap="$2">
      <Text fontSize="$3" fontWeight="800" color="$text">
        {t("auth.email")}
      </Text>
      <Controller
        control={control}
        name="email"
        rules={{
          required: t("auth.emailRequired"),
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: t("auth.invalidEmail"),
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            placeholder="your@email.com"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
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
