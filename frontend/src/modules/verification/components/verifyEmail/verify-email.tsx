import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  useConfirmEmailRegistration,
  useSendEmailRegistration,
} from "@/src/modules/auth";
import { getErrorMessage } from "@/src/core/utils";
import { Alert } from "react-native";
import { VerificationCodeScreen } from "../verificationCodeScreen/verification-code-screen";

export function VerifyEmail() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  const confirmEmailMutation = useConfirmEmailRegistration();
  const resendCodeMutation = useSendEmailRegistration();

  const handleVerifySuccess = async (code: string) => {
    try {
      // TODO API
      // await confirmEmailMutation.mutateAsync({
      //   email,
      //   code,
      // });

      router.push({
        pathname: "/profile-filling",
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert(t("auth.error") || "Ошибка", errorMessage);
      console.error("Email verification error:", error);
    }
  };

  const handleResendCode = async () => {
    try {
      // TODO API
      // await resendCodeMutation.mutateAsync({ email });
      Alert.alert(
        t("auth.success") || "Успешно",
        t("auth.codeSent") || "Код отправлен на ваш email",
      );
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      Alert.alert(t("auth.error") || "Ошибка", errorMessage);
      console.error("Resend code error:", error);
    }
  };

  return (
    <VerificationCodeScreen
      email={email}
      icon="✉️"
      title={t("auth.verifyEmail")}
      onVerifySuccess={handleVerifySuccess}
      onResendCode={handleResendCode}
      showBackButton={false}
      useConfirmButton={false}
    />
  );
}
