import React, { useState } from "react";
import { Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm, Controller } from "react-hook-form";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import {
  PasswordInput,
  EmailInput,
  useRegister,
  useSendEmailRegistration,
} from "@/src/modules/auth";
import { ErrorMessage, StyledButton } from "@/src/shared";
import { useTranslation } from "react-i18next";
import { getErrorMessage } from "@/src/core";

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function Registration() {
  const { t } = useTranslation();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>("");

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

  const registerMutation = useRegister();
  const sendEmailMutation = useSendEmailRegistration();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMsg("");

      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      await sendEmailMutation.mutateAsync({
        email: data.email,
      });

      router.push({
        pathname: "/verify-email",
        params: { email: data.email },
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setErrorMsg(errorMessage);
      console.warn("Registration error:", error);
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
            {t("auth.joinTipster")}
          </Text>

          <YStack gap="$4" width="100%">
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
              showStrengthHint
              rules={{
                required: t("auth.passwordRequired"),
                minLength: {
                  value: 12,
                  message: t("auth.passwordMinLength"),
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
                required: t("auth.confirmPasswordRequired"),
                validate: (value) =>
                  value === password || t("auth.passwordsMustMatch"),
              }}
            />

            <StyledButton
              onPress={handleSubmit(onSubmit)}
              disabled={
                isSubmitting ||
                registerMutation.isPending ||
                sendEmailMutation.isPending
              }
              opacity={
                isSubmitting ||
                registerMutation.isPending ||
                sendEmailMutation.isPending
                  ? 0.5
                  : 1
              }
              text={
                isSubmitting ||
                registerMutation.isPending ||
                sendEmailMutation.isPending
                  ? t("auth.sendingCode")
                  : t("auth.continue")
              }
            />

            <ErrorMessage message={errorMsg} visible={!!errorMsg} />

            <Text
              fontSize="$2"
              color="$text"
              opacity={0.5}
              textAlign="center"
              lineHeight={18}
            >
              {t("auth.termsAgreement")}
            </Text>

            <Text fontSize="$3" color="$text" opacity={0.5} textAlign="center">
              {t("auth.or")}
            </Text>

            <XStack justifyContent="center" alignItems="center" gap="$2">
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
