import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { VerificationCodeScreen } from "./VerificationCodeScreen";
import { useTranslation } from "react-i18next";

export function ForgotPasswordVerify() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  const handleVerifySuccess = async (code: string) => {
    // TODO: Implement verification API call
    console.log("Verifying code:", code);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.push({
      pathname: "/reset-password",
      params: { email, code },
    });
  };

  const handleResendCode = async () => {
    // TODO: Implement resend code API call
    console.log("Resending code to:", email);
  };

  return (
    <VerificationCodeScreen
      email={email}
      icon="🔑"
      title={t("auth.enterCode")}
      onVerifySuccess={handleVerifySuccess}
      onResendCode={handleResendCode}
      showBackButton={true}
      useConfirmButton={true}
    />
  );
}
