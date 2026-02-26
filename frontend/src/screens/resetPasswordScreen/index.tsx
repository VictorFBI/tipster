import React from "react";
import { Platform, KeyboardAvoidingView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm } from "react-hook-form";
import { YStack, Text, ScrollView } from "tamagui";
import { ConfirmButton } from "../../shared/ui/confirmButton";
import { PasswordInput } from "../../shared/ui/passwordInput";
import { useTranslation } from "react-i18next";

type ResetPasswordFormData = {
  password: string;
  confirmPassword: string;
};

export function ResetPassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const code = params.code as string;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      console.log("Reset password:", {
        email,
        code,
        newPassword: data.password,
      });

      // TODO: Call reset password API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.replace("/login");
    } catch (error) {
      console.error("Reset password error:", error);
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
              <Text fontSize={40}>🔒</Text>
            </YStack>
          </YStack>

          <Text
            fontSize="$9"
            fontWeight="bold"
            color="$text"
            textAlign="center"
          >
            {t("auth.newPassword")}
          </Text>

          <Text fontSize="$3" color="$text" opacity={0.7} textAlign="center">
            {t("auth.newPasswordDescription")}
          </Text>

          <YStack space="$4" width="100%" marginTop="$6">
            <PasswordInput
              label={t("auth.newPassword")}
              control={control}
              errors={errors.password}
              message={errors.password?.message}
              rules={{
                required: t("auth.passwordRequired"),
                minLength: {
                  value: 6,
                  message: t("auth.passwordMinLength"),
                },
              }}
            />

            <PasswordInput
              label={t("auth.repeatPassword")}
              control={control}
              errors={errors.confirmPassword}
              message={errors.confirmPassword?.message}
              rules={{
                required: t("auth.confirmPasswordRequired"),
                validate: (value) =>
                  value === password || t("auth.passwordsMustMatch"),
              }}
              controlName="confirmPassword"
            />

            <ConfirmButton
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              opacity={isSubmitting ? 0.5 : 1}
              text={isSubmitting ? t("auth.saving") : t("auth.savePassword")}
            />
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
