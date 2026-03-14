import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { VerificationCodeScreen } from "./VerificationCodeScreen";
import { useTranslation } from "react-i18next";
import {
  useConfirmEmailResetPassword,
  useSendEmailResetPassword,
} from "../../auth/hooks";
import { getErrorMessage } from "../../../core/utils/errorHandler";
import { Alert } from "react-native";

export function ForgotPasswordVerify() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const [error, setError] = useState<string>("");

  const confirmEmailMutation = useConfirmEmailResetPassword();
  const sendEmailMutation = useSendEmailResetPassword();

  const handleVerifySuccess = async (code: string) => {
    try {
      setError("");

      await confirmEmailMutation.mutateAsync({
        email,
        code,
      });

      router.push({
        pathname: "/reset-password",
        params: { email, code },
      });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      Alert.alert(t("auth.error"), errorMessage);
    }
  };

  const handleResendCode = async () => {
    try {
      setError("");
      await sendEmailMutation.mutateAsync({ email });
      Alert.alert(t("auth.success"), t("auth.codeSent"));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      Alert.alert(t("auth.error"), errorMessage);
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
