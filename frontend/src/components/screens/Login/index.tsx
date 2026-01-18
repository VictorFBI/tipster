import React from "react";
import { Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm } from "react-hook-form";
import { YStack, XStack, Text, Input, View } from "tamagui";
import { useTranslation } from "react-i18next";
import { ConfirmButton } from "../../ui/confirmButton";
import { PasswordInput } from "../../ui/passwordInput";
import { EmailInput } from "../../ui/emailInput";

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
                  required: t("auth.passwordRequired"),
                  minLength: {
                    value: 6,
                    message:
                      t("auth.passwordMinLength") ||
                      "Password must be at least 6 characters",
                  },
                }}
              />

              <XStack justifyContent="flex-end" marginTop="$1">
                <TouchableOpacity
                  onPress={() => router.push("/forgot-password")}
                >
                  <Text fontSize="$3" color="$accent" fontWeight="600">
                    {t("auth.forgotPassword")}
                  </Text>
                </TouchableOpacity>
              </XStack>
            </YStack>

            <ConfirmButton
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              opacity={isSubmitting ? 0.5 : 1}
              text={isSubmitting ? t("auth.loggingIn") : t("auth.login")}
            />

            <Text
              fontSize="$3"
              color="$text"
              opacity={0.5}
              textAlign="center"
              marginVertical="$2"
            >
              {t("auth.or")}
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
