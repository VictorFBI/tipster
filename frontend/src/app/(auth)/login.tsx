import React from "react";
import { Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
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
  View,
} from "tamagui";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // TODO: Implement login logic
  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log("Login:", data);
      // TODO: Add actual authentication logic here
      // For now, just navigate to tabs
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar style="light" />
      <View flex={1} backgroundColor="$background">
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
                marginBottom="$4"
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
            Tipster
          </Text>
          <Text
            fontSize="$3"
            color="$color"
            opacity={0.7}
            textAlign="center"
            marginBottom="$8"
          >
            Зарабатывайте криптовалюту за активность
          </Text>

          <YStack space="$4" width="100%">
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
                    secureTextEntry
                    autoComplete="password"
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
                  {isSubmitting ? "Вход..." : "Войти"}
                </Text>
              </Button>
            </Theme>

            <Text
              fontSize="$3"
              color="$color"
              opacity={0.5}
              textAlign="center"
              marginVertical="$2"
            >
              или
            </Text>

            <XStack justifyContent="center" alignItems="center" space="$2">
              <Text fontSize="$3" color="$color" opacity={0.7}>
                Еще нет аккаунта?
              </Text>
              <Theme name="accent">
                <Link href="/register" asChild>
                  <TouchableOpacity>
                    <Text
                      fontSize="$3"
                      color={theme.accentColor?.get()}
                      fontWeight="800"
                    >
                      Зарегистрироваться
                    </Text>
                  </TouchableOpacity>
                </Link>
              </Theme>
            </XStack>
          </YStack>
        </YStack>
      </View>
    </KeyboardAvoidingView>
  );
}
