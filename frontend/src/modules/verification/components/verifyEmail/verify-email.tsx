import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  useConfirmEmailRegistration,
  useSendEmailRegistration,
  useLogin,
} from "@/src/modules/auth";
import { getErrorMessage, showAlert } from "@/src/core";
import { VerificationCodeScreen } from "../verificationCodeScreen/verification-code-screen";

export function VerifyEmail() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const password = params.password as string;

  const confirmEmailMutation = useConfirmEmailRegistration();
  const resendCodeMutation = useSendEmailRegistration();
  const loginMutation = useLogin();

  const handleVerifySuccess = async (code: string) => {
    // 1. Confirm email registration
    await confirmEmailMutation.mutateAsync({
      email,
      code,
    });

    // 2. Auto-login to get JWT tokens before navigating to profile filling
    await loginMutation.mutateAsync({
      email,
      password,
    });

    // 3. Navigate to profile filling (now authenticated)
    router.push({
      pathname: "/profile-filling",
    });
  };

  const handleResendCode = async () => {
    try {
      await resendCodeMutation.mutateAsync({ email });
      showAlert(t("common.success"), t("auth.verificationCodeSent"));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showAlert(t("common.error") || "Ошибка", errorMessage);
      console.warn("Resend code error:", error);
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
