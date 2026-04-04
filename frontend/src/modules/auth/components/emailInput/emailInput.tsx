import { Controller, Control, FieldError } from "react-hook-form";
import { YStack, Text } from "tamagui";
import { useTranslation } from "react-i18next";
import { StyledInput } from "@/src/shared";

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
          <StyledInput
            placeholder="your@email.com"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            autoComplete="email"
            hasError={!!errors}
            inputSize="l"
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
