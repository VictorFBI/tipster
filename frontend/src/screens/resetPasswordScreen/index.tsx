import React, { useState } from "react";
import { Platform, KeyboardAvoidingView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm } from "react-hook-form";
import { YStack, Text, ScrollView } from "tamagui";
import { PasswordInput, useResetPassword } from "@/src/modules/auth";
import { ErrorMessage, StyledButton } from "@/src/shared";
import { useTranslation } from "react-i18next";
import { getErrorMessage, showAlert } from "@/src/core";

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
  const [error, setError] = useState<string>("");

  const resetPasswordMutation = useResetPassword();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setError("");

      await resetPasswordMutation.mutateAsync({
        email,
        password: data.password,
      });

      // Успешный сброс пароля - перенаправляем на логин
      showAlert(t("common.success"), t("auth.passwordResetSuccess"), [
        {
          text: t("common.ok"),
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch (err) {
      setError(getErrorMessage(err));
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
          gap="$4"
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

          <YStack gap="$4" width="100%" marginTop="$6">
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

            {error && <ErrorMessage message={error} />}

            <StyledButton
              onPress={handleSubmit(onSubmit)}
              disabled={resetPasswordMutation.isPending}
              opacity={resetPasswordMutation.isPending ? 0.5 : 1}
              text={
                resetPasswordMutation.isPending
                  ? t("auth.saving")
                  : t("auth.savePassword")
              }
            />
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
