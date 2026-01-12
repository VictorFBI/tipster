import React from "react";
import { Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm, Controller } from "react-hook-form";
import { YStack, XStack, Text, Input, Button, View } from "tamagui";
import { useTranslation } from "react-i18next";

type LoginFormData = {
  email: string;
  password: string;
};

export function Login() {
  const { t } = useTranslation();
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
      <View flex={1} backgroundColor="$background2">
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
              marginBottom="$4"
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
            Tipster
          </Text>
          <Text
            fontSize="$3"
            color="$text"
            opacity={0.7}
            textAlign="center"
            marginBottom="$8"
          >
            Зарабатывайте криптовалюту за активность
          </Text>

          <YStack space="$4" width="100%">
            <YStack space="$2">
              <Text fontSize="$3" fontWeight="800" color="$text">
                {t("auth.email")}
              </Text>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: t("auth.emailRequired") || "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("auth.invalidEmail") || "Invalid email format",
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
                    borderColor={errors.email ? "$red10" : "$border"}
                    color="$text"
                    placeholderTextColor="$placeholder"
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
              <Text fontSize="$3" fontWeight="800" color="$text">
                {t("auth.password")}
              </Text>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: t("auth.passwordRequired"),
                  minLength: {
                    value: 6,
                    message:
                      t("auth.passwordMinLength") ||
                      "Password must be at least 6 characters",
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
                    backgroundColor="$background2"
                    borderColor={errors.password ? "$red10" : "$border"}
                    color="$text"
                    placeholderTextColor="$placeholder"
                  />
                )}
              />
              {errors.password && (
                <Text fontSize="$2" color="$red10">
                  {errors.password.message}
                </Text>
              )}
            </YStack>

            <Button
              size="$5"
              marginTop="$2"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              opacity={isSubmitting ? 0.5 : 1}
              pressStyle={{ opacity: 0.8 }}
              backgroundColor="$accent"
            >
              <Text fontSize="$5" fontWeight="800" color="white">
                {isSubmitting ? t("auth.loggingIn") : t("auth.login")}
              </Text>
            </Button>

            <Text
              fontSize="$3"
              color="$text"
              opacity={0.5}
              textAlign="center"
              marginVertical="$2"
            >
              или
            </Text>

            <XStack justifyContent="center" alignItems="center" space="$2">
              <Text fontSize="$3" color="$text" opacity={0.7}>
                {t("auth.dontHaveAccount")}
              </Text>

              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text fontSize="$3" color={"$accent"} fontWeight="800">
                    {t("auth.register")}
                  </Text>
                </TouchableOpacity>
              </Link>
            </XStack>
          </YStack>
        </YStack>
      </View>
    </KeyboardAvoidingView>
  );
}
