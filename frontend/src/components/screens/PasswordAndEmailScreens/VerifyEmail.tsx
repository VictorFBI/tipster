import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { VerificationCodeScreen } from "./VerificationCodeScreen";

export function VerifyEmail() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

  const handleVerifySuccess = async (code: string) => {
    // TODO: Implement verification API call
    console.log("Verifying code:", code);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    router.replace("/(tabs)");
  };

  const handleResendCode = async () => {
    // TODO: Implement resend code API call
    console.log("Resending code to:", email);
  };

  return (
    <VerificationCodeScreen
      email={email}
      icon="✉️"
      title="Подтвердите email"
      onVerifySuccess={handleVerifySuccess}
      onResendCode={handleResendCode}
      showBackButton={false}
      useConfirmButton={false}
    />
  );
}
