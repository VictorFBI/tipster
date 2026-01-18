import { Controller } from "react-hook-form";
import { YStack, Text, Input } from "tamagui";

export function PasswordInput({
  label,
  control,
  errors,
  message,
  rules = {
    required: "Пароль обязателен",
    minLength: {
      value: 6,
      message: "Пароль должен быть минимум 6 символов",
    },
  },
  controlName = "password",
}) {
  return (
    <YStack space="$2">
      <Text fontSize="$3" fontWeight="800" color="$text">
        {label}
      </Text>
      <Controller
        control={control}
        name={controlName}
        rules={rules}
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
