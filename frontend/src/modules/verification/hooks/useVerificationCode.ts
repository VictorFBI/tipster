import { useState, useRef, useEffect } from "react";
import { TextInput } from "react-native";
import { getErrorMessage } from "@/src/core/utils";
import {
  VERIFICATION_CODE_LENGTH,
  VERIFICATION_RESEND_COOLDOWN_SECONDS,
} from "@/src/shared/constants/limits";

interface UseVerificationCodeOptions {
  onVerifySuccess: (code: string) => void | Promise<void>;
  onResendCode?: () => void | Promise<void>;
  errorInvalidCode: string;
  errorIncompleteCode: string;
  resendCooldown?: number; // in seconds
}

export function useVerificationCode({
  onVerifySuccess,
  onResendCode,
  errorInvalidCode,
  errorIncompleteCode,
  resendCooldown = VERIFICATION_RESEND_COOLDOWN_SECONDS,
}: UseVerificationCodeOptions) {
  const [code, setCode] = useState(Array(VERIFICATION_CODE_LENGTH).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (resendTimer > 0) {
      timerRef.current = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resendTimer]);

  useEffect(() => {
    // Start timer on mount
    setResendTimer(resendCooldown);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [resendCooldown]);

  const handleCodeChange = (value: string, index: number) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    if (value && index < VERIFICATION_CODE_LENGTH - 1) {
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

    if (verificationCode.length !== VERIFICATION_CODE_LENGTH) {
      setError(errorIncompleteCode);
      return;
    }

    setIsVerifying(true);
    try {
      await onVerifySuccess(verificationCode);
    } catch (err) {
      console.warn("Verification error:", err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setCode(Array(VERIFICATION_CODE_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (onResendCode && resendTimer === 0) {
      try {
        await onResendCode();
        setResendTimer(resendCooldown);
      } catch (err) {
        console.warn("Resend error:", err);
      }
    }
  };

  return {
    code,
    isVerifying,
    error,
    inputRefs,
    resendTimer,
    handleCodeChange,
    handleKeyPress,
    handleVerify,
    handleResendCode,
  };
}
