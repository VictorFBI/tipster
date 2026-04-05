import { useState, useRef, useEffect } from "react";
import { TextInput } from "react-native";

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
  resendCooldown = 60,
}: UseVerificationCodeOptions) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
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
    if (onResendCode && resendTimer === 0) {
      try {
        await onResendCode();
        setResendTimer(resendCooldown);
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
    resendTimer,
    handleCodeChange,
    handleKeyPress,
    handleVerify,
    handleResendCode,
  };
}
