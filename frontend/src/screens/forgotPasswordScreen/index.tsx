import React from "react";
import { Platform, KeyboardAvoidingView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useForm } from "react-hook-form";
import { YStack, XStack, Text, ScrollView } from "tamagui";
import { ConfirmButton } from "../../shared/ui/confirmButton";
import { EmailInput } from "../../shared/ui/emailInput";
import { useTranslation } from "react-i18next";

type ForgotPasswordFormData = {
  email: string;
};

export function ForgotPassword() {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      console.log("Forgot password:", data);

      // TODO: Call forgot password API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.push({
        pathname: "/forgot-password-verify",
        params: { email: data.email },
      });
    } catch (error) {
      console.error("Forgot password error:", error);
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
              <Text fontSize={40}>🔑</Text>
            </YStack>
          </YStack>

          <Text
            fontSize="$9"
            fontWeight="bold"
            color="$text"
            textAlign="center"
          >
            {t("auth.forgetPassword")}
          </Text>

          <Text fontSize="$3" color="$text" opacity={0.7} textAlign="center">
            {t("auth.enterEmail")}
          </Text>

          <YStack gap="$4" width="100%" marginTop="$6">
            <EmailInput
              control={control}
              errors={errors.email}
              message={errors.email?.message}
            />

            <ConfirmButton
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              opacity={isSubmitting ? 0.5 : 1}
              text={isSubmitting ? t("auth.sending") : t("auth.sendCode")}
            />

            <XStack
              justifyContent="center"
              alignItems="center"
              gap="$2"
              marginTop="$4"
            >
              <TouchableOpacity onPress={() => router.back()}>
                <Text fontSize="$3" color="$accent" fontWeight="800">
                  {t("auth.back")}
                </Text>
              </TouchableOpacity>
            </XStack>
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
