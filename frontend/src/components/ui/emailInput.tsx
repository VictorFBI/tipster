import { Controller } from "react-hook-form";
import { YStack, Text, Input } from "tamagui";

export function EmailInput({ control, errors, message }) {
  return (
    <YStack space="$2">
      <Text fontSize="$3" fontWeight="800" color="$text">
        Email
      </Text>
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email обязателен",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Неверный формат email",
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
