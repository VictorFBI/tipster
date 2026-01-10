import React from "react";
import { Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm, Controller } from "react-hook-form";
import {
  YStack,
  XStack,
  Text,
  Input,
  Button,
  Theme,
  useTheme,
  ScrollView,
} from "tamagui";

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterScreen() {
  const theme = useTheme();

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
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "$background" }}
    >
      <StatusBar style="light" />
      <ScrollView flex={1} backgroundColor="$background">
        <YStack
          flex={1}
          paddingHorizontal="$6"
          paddingTop="$12"
          paddingBottom="$8"
          space="$4"
        >
          <YStack alignItems="center">
            <Theme name="accent">
              <YStack
                width={80}
                height={80}
                borderRadius={40}
                backgroundColor="$color"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize={40}>🔗</Text>
              </YStack>
            </Theme>
          </YStack>

          <Text
            fontSize="$9"
            fontWeight="bold"
            color="$color"
            textAlign="center"
          >
            Создать аккаунт
          </Text>
          <Text fontSize="$3" color="$color" opacity={0.7} textAlign="center">
            Присоединяйтесь к Tipster и начните зарабатывать
          </Text>

          <YStack space="$4" width="100%">
            <YStack space="$2">
              <Text fontSize="$3" fontWeight="800" color="$color">
                Имя пользователя
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
                    backgroundColor="$background"
                    borderColor={errors.username ? "$red10" : "$borderColor"}
                    color="$color"
                    placeholderTextColor="$placeholderColor"
                  />
                )}
              />
              {errors.username && (
                <Text fontSize="$2" color="$red10">
                  {errors.username.message}
                </Text>
              )}
            </YStack>

            <YStack space="$2">
              <Text fontSize="$3" fontWeight="800" color="$color">
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
                    backgroundColor="$background"
                    borderColor={errors.email ? "$red10" : "$borderColor"}
                    color="$color"
                    placeholderTextColor="$placeholderColor"
                  />
                )}
              />
              {errors.email && (
                <Text fontSize="$2" color="$red10">
                  {errors.email.message}
                </Text>
              )}
            </YStack>

            <YStack space="$2">
              <Text fontSize="$3" fontWeight="800" color="$color">
                Пароль
              </Text>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Пароль обязателен",
                  minLength: {
                    value: 6,
                    message: "Пароль должен быть минимум 6 символов",
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="••••••••"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    // secureTextEntry
                    // autoComplete="off"
                    // textContentType="none"
                    // passwordRules=""
                    size="$5"
                    backgroundColor="$background"
                    borderColor={errors.password ? "$red10" : "$borderColor"}
                    color="$color"
                    placeholderTextColor="$placeholderColor"
                  />
                )}
              />
              {errors.password && (
                <Text fontSize="$2" color="$red10">
                  {errors.password.message}
                </Text>
              )}
            </YStack>

            <YStack space="$2">
              <Text fontSize="$3" fontWeight="800" color="$color">
                Повторите пароль
              </Text>
              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  required: "Подтверждение пароля обязательно",
                  validate: (value) =>
                    value === password || "Пароли не совпадают",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="••••••••"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    // secureTextEntry
                    // autoComplete="off"
                    // textContentType="none"
                    // passwordRules=""
                    size="$5"
                    backgroundColor="$background"
                    borderColor={
                      errors.confirmPassword ? "$red10" : "$borderColor"
                    }
                    color="$color"
                    placeholderTextColor="$placeholderColor"
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text fontSize="$2" color="$red10">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </YStack>

            <Theme name="accent">
              <Button
                size="$5"
                marginTop="$2"
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                opacity={isSubmitting ? 0.5 : 1}
                pressStyle={{ opacity: 0.8 }}
              >
                <Text fontSize="$5" fontWeight="800" color="white">
                  {isSubmitting ? "Создание..." : "Создать аккаунт"}
                </Text>
              </Button>
            </Theme>

            <Text
              fontSize="$2"
              color="$color"
              opacity={0.5}
              textAlign="center"
              lineHeight={18}
            >
              Регистрируясь, вы соглашаетесь с условиями использования и
              политикой конфиденциальности
            </Text>

            <Text fontSize="$3" color="$color" opacity={0.5} textAlign="center">
              или
            </Text>

            <XStack justifyContent="center" alignItems="center" space="$2">
              <Text fontSize="$3" color="$color" opacity={0.7}>
                Уже есть аккаунт?
              </Text>
              <Theme name="accent">
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <Text
                      fontSize="$3"
                      color={theme.accentColor?.get()}
                      fontWeight="800"
                    >
                      Войти
                    </Text>
                  </TouchableOpacity>
                </Link>
              </Theme>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
