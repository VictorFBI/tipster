import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  useConfirmEmailResetPassword,
  useSendEmailResetPassword,
} from "@/src/modules/auth";
import { Alert } from "react-native";
import { getErrorMessage } from "@/src/core/utils";
import { VerificationCodeScreen } from "../verificationCodeScreen/verification-code-screen";

export function ForgotPasswordVerify() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [error, setError] = useState<string>("");

  const confirmEmailMutation = useConfirmEmailResetPassword();
  const sendEmailMutation = useSendEmailResetPassword();

  const handleVerifySuccess = async (code: string) => {
    setError("");

    const res = await confirmEmailMutation.mutateAsync({
      email,
      code,
    });
    console.log("Confirm email response:", res);

    router.push({
      pathname: "/reset-password",
      params: { email, code },
    });
  };

  const handleResendCode = async () => {
    try {
      setError("");
      // TODO API
      await sendEmailMutation.mutateAsync({ email });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    }
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
