import { Platform, KeyboardAvoidingView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { YStack, Text, ScrollView } from "tamagui";
import { useTranslation } from "react-i18next";
import {
  CodeInput,
  ResendSection,
  useVerificationCode,
  VerificationIcon,
} from "@/src/modules/verification";
import { StyledButton } from "@/src/shared";

interface VerificationCodeScreenProps {
  email: string;
  icon: string;
  title: string;
  onVerifySuccess: (code: string) => void | Promise<void>;
  onResendCode?: () => void | Promise<void>;
  showBackButton?: boolean;
  useConfirmButton?: boolean;
  codeInputLabel?: string;
  verifyButtonText?: string;
  verifyingButtonText?: string;
  resendText?: string;
  resendButtonText?: string;
  errorInvalidCode?: string;
  errorIncompleteCode?: string;
}

export function VerificationCodeScreen({
  email,
  icon,
  title,
  onVerifySuccess,
  onResendCode,
  useConfirmButton = false,
  codeInputLabel,
  verifyButtonText,
  verifyingButtonText,
  resendText,
  resendButtonText,
  errorInvalidCode,
  errorIncompleteCode,
}: VerificationCodeScreenProps) {
  const { t } = useTranslation();

  const finalCodeInputLabel = codeInputLabel || t("auth.enterVerificationCode");
  const finalVerifyButtonText = verifyButtonText || t("auth.verify");
  const finalVerifyingButtonText = verifyingButtonText || t("auth.verifying");
  const finalResendText = resendText || t("auth.didntReceiveCode");
  const finalResendButtonText = resendButtonText || t("auth.resendCode");
  const finalErrorInvalidCode = errorInvalidCode || t("auth.invalidCode");
  const finalErrorIncompleteCode =
    errorIncompleteCode || t("auth.enterFullCode");

  const {
    code,
    isVerifying,
    error,
    inputRefs,
    resendTimer,
    handleCodeChange,
    handleKeyPress,
    handleVerify,
    handleResendCode,
  } = useVerificationCode({
    onVerifySuccess,
    onResendCode,
    errorInvalidCode: finalErrorInvalidCode,
    errorIncompleteCode: finalErrorIncompleteCode,
  });

  const isCodeComplete = code.join("").length === 6;
  const disabled = isVerifying || !isCodeComplete;

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
              <Text fontSize={40}>{icon}</Text>
            </YStack>
          </YStack>

          <Text
            fontSize="$9"
            fontWeight="bold"
            color="$text"
            textAlign="center"
          >
            {title}
          </Text>

          <Text fontSize="$3" color="$text" opacity={0.7} textAlign="center">
            {t("auth.verificationCodeSent")}
          </Text>

          <Text
            fontSize="$4"
            color="$accent"
            fontWeight="800"
            textAlign="center"
          >
            {email}
          </Text>

          <YStack gap="$4" width="100%" marginTop="$6">
            <CodeInput
              code={code}
              error={error}
              label={finalCodeInputLabel}
              inputRefs={inputRefs}
              onCodeChange={handleCodeChange}
              onKeyPress={handleKeyPress}
            />

            <StyledButton
              onPress={handleVerify}
              disabled={disabled}
              text={
                isVerifying ? finalVerifyingButtonText : finalVerifyButtonText
              }
              buttonSize="l"
            />

            <ResendSection
              resendText={finalResendText}
              resendButtonText={finalResendButtonText}
              onResend={handleResendCode}
              resendTimer={resendTimer}
            />
          </YStack>
        </YStack>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
