import React, { useState, useRef } from "react";
import {
  Platform,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { YStack, XStack, Text, Button, ScrollView } from "tamagui";
import { ConfirmButton } from "../../shared/ui/confirmButton";
import { useTranslation } from "react-i18next";

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
  
  // Set default values using translation
  const finalCodeInputLabel = codeInputLabel || t("auth.enterVerificationCode");
  const finalVerifyButtonText = verifyButtonText || t("auth.verify");
  const finalVerifyingButtonText = verifyingButtonText || t("auth.verifying");
  const finalResendText = resendText || t("auth.didntReceiveCode");
  const finalResendButtonText = resendButtonText || t("auth.resendCode");
  const finalErrorInvalidCode = errorInvalidCode || t("auth.invalidCode");
  const finalErrorIncompleteCode = errorIncompleteCode || t("auth.enterFullCode");
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (value: string, index: number) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      setError(finalErrorIncompleteCode);
      return;
    }

    setIsVerifying(true);
    try {
      await onVerifySuccess(verificationCode);
    } catch (error) {
      console.error("Verification error:", error);
      setError(finalErrorInvalidCode);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (onResendCode) {
      try {
        await onResendCode();
      } catch (error) {
        console.error("Resend error:", error);
      }
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
          space="$4"
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

          <YStack space="$4" width="100%" marginTop="$6">
            <Text
              fontSize="$3"
              fontWeight="800"
              color="$text"
              textAlign="center"
            >
              {finalCodeInputLabel}
            </Text>

            <XStack justifyContent="center" space="$3">
              {code.map((digit, index) => (
                <YStack
                  key={index}
                  width={50}
                  height={60}
                  borderRadius="$4"
                  borderWidth={2}
                  borderColor={error ? "$error" : digit ? "$accent" : "$border"}
                  backgroundColor="$background2"
                  alignItems="center"
                  justifyContent="center"
                >
                  <TextInput
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    value={digit}
                    onChangeText={(value) => handleCodeChange(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      textAlign: "center",
                      width: "100%",
                      height: "100%",
                      color: "#FFFFFF",
                    }}
                  />
                </YStack>
              ))}
            </XStack>

            {error && (
              <Text fontSize="$3" color="$error" textAlign="center">
                {error}
              </Text>
            )}

            {useConfirmButton ? (
              <ConfirmButton
                onPress={handleVerify}
                disabled={isVerifying || code.join("").length !== 6}
                opacity={isVerifying || code.join("").length !== 6 ? 0.5 : 1}
                text={isVerifying ? finalVerifyingButtonText : finalVerifyButtonText}
              />
            ) : (
              <Button
                size="$5"
                marginTop="$4"
                onPress={handleVerify}
                disabled={isVerifying || code.join("").length !== 6}
                opacity={isVerifying || code.join("").length !== 6 ? 0.5 : 1}
                pressStyle={{ opacity: 0.8 }}
                backgroundColor="$accent"
              >
                <Text fontSize="$5" fontWeight="800" color="white">
                  {isVerifying ? finalVerifyingButtonText : finalVerifyButtonText}
                </Text>
              </Button>
            )}

            <YStack space="$2" marginTop="$4">
              <Text
                fontSize="$3"
                color="$text"
                opacity={0.7}
                textAlign="center"
              >
                {finalResendText}
              </Text>
              <Button
                size="$4"
                onPress={handleResendCode}
                backgroundColor="transparent"
                pressStyle={{ opacity: 0.7 }}
              >
                <Text fontSize="$4" color="$accent" fontWeight="800">
                  {finalResendButtonText}
                </Text>
              </Button>
            </YStack>

            <XStack
              justifyContent="center"
              alignItems="center"
              space="$2"
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
