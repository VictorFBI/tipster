import { useState, useRef } from "react";
import { TextInput } from "react-native";

interface UseVerificationCodeOptions {
  onVerifySuccess: (code: string) => void | Promise<void>;
  onResendCode?: () => void | Promise<void>;
  errorInvalidCode: string;
  errorIncompleteCode: string;
}

export function useVerificationCode({
  onVerifySuccess,
  onResendCode,
  errorInvalidCode,
  errorIncompleteCode,
}: UseVerificationCodeOptions) {
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
      setError(errorIncompleteCode);
      return;
    }

    setIsVerifying(true);
    try {
      await onVerifySuccess(verificationCode);
    } catch (err) {
      console.error("Verification error:", err);
      setError(errorInvalidCode);
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
      } catch (err) {
        console.error("Resend error:", err);
      }
    }
  };

  return {
    code,
    isVerifying,
    error,
    inputRefs,
    handleCodeChange,
    handleKeyPress,
    handleVerify,
    handleResendCode,
  };
}
