import React from "react";
import { Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm, Controller } from "react-hook-form";
import { YStack, XStack, Text, Input, Button, ScrollView } from "tamagui";
import { ConfirmButton } from "../../ui/confirmButton";
import { PasswordInput } from "../../ui/passwordInput";
import { EmailInput } from "../../ui/emailInput";
import { t } from "i18next";

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function Registration() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  // TODO: Implement registration logic
  const onSubmit = async (data: RegisterFormData) => {
    try {
      console.log("Register:", data);

      // TODO: Call registration API
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to verify-email screen with email parameter
      router.push({
        pathname: "/verify-email",
        params: { email: data.email },
      });
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "$background2" }}
    >
      <StatusBar style="light" />
      <ScrollView flex={1} backgroundColor="$background2">
        <YStack
          flex={1}
          paddingHorizontal="$6"
          paddingTop="$12"
          paddingBottom="$8"
          space="$4"
        >
          <YStack alignItems="center">
            <YStack
              width={80}
              height={80}
              borderRadius={40}
              backgroundColor="$accent"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize={40}>🔗</Text>
            </YStack>
          </YStack>

          <Text
            fontSize="$9"
            fontWeight="bold"
            color="$text"
            textAlign="center"
          >
            {t("auth.createAccount")}
          </Text>
          <Text fontSize="$3" color="$text" opacity={0.7} textAlign="center">
            Присоединяйтесь к Tipster и начните зарабатывать
          </Text>

          <YStack space="$4" width="100%">
            <YStack space="$2">
              <Text fontSize="$3" fontWeight="800" color="$text">
                {t("auth.username")}
              </Text>
              <Controller
                control={control}
                name="username"
                rules={{
                  required: "Имя пользователя обязательно",
                  minLength: {
                    value: 3,
                    message: "Минимум 3 символа",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "Только буквы, цифры и подчеркивание",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="username"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                    autoComplete="username"
                    size="$5"
                    backgroundColor="$background2"
                    borderColor={errors.username ? "$error" : "$border"}
                    color="$text"
                    placeholderTextColor="$placeholder"
                  />
                )}
              />
              {errors.username && (
                <Text fontSize="$2" color="$error">
                  {errors.username.message}
                </Text>
              )}
            </YStack>

            <EmailInput
              control={control}
              errors={errors.email}
              message={errors.email?.message}
            />

            <PasswordInput
              label={t("auth.password")}
              control={control}
              errors={errors.password}
              message={errors.password?.message}
              rules={{
                required: "Пароль обязателен",
                minLength: {
                  value: 6,
                  message: "Пароль должен быть минимум 6 символов",
                },
              }}
            />

            <PasswordInput
              label={t("auth.repeatPassword")}
              control={control}
              errors={errors.confirmPassword}
              message={errors.confirmPassword?.message}
              controlName="confirmPassword"
              rules={{
                required: "Подтверждение пароля обязательно",
                validate: (value) =>
                  value === password || "Пароли не совпадают",
              }}
            />

            <ConfirmButton
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              opacity={isSubmitting ? 0.5 : 1}
              text={isSubmitting ? "Отправляем код на почту..." : "Продолжить"}
            />

            <Text
              fontSize="$2"
              color="$text"
              opacity={0.5}
              textAlign="center"
              lineHeight={18}
            >
              Регистрируясь, вы соглашаетесь с условиями использования и
              политикой конфиденциальности
            </Text>

            <Text fontSize="$3" color="$text" opacity={0.5} textAlign="center">
              {t("auth.or")}
            </Text>

            <XStack justifyContent="center" alignItems="center" space="$2">
              <Text fontSize="$3" color="$text" opacity={0.7}>
                {t("auth.alreadyHaveAccount")}
              </Text>

              <Link href="/login" asChild>
                <TouchableOpacity>
                  <Text fontSize="$3" color={"$accent"} fontWeight="800">
                    {t("auth.login")}
                  </Text>
                </TouchableOpacity>
              </Link>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
