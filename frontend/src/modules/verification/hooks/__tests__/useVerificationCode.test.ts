import { renderHook, act } from "@testing-library/react-native";
import { useVerificationCode } from "../useVerificationCode";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useVerificationCode", () => {
  const defaultOptions = {
    onVerifySuccess: jest.fn(),
    onResendCode: jest.fn(),
    errorInvalidCode: "Invalid code",
    errorIncompleteCode: "Incomplete code",
    resendCooldown: 60,
  };

  it("initializes with empty code array", () => {
    const { result } = renderHook(() => useVerificationCode(defaultOptions));

    expect(result.current.code).toEqual(["", "", "", "", "", ""]);
    expect(result.current.isVerifying).toBe(false);
    expect(result.current.error).toBe("");
  });

  it("starts resend timer on mount", () => {
    const { result } = renderHook(() => useVerificationCode(defaultOptions));

    expect(result.current.resendTimer).toBe(60);
  });

  describe("handleCodeChange", () => {
    it("updates code at the given index", () => {
      const { result } = renderHook(() => useVerificationCode(defaultOptions));

      act(() => {
        result.current.handleCodeChange("1", 0);
      });

      expect(result.current.code[0]).toBe("1");
    });

    it("rejects non-digit input", () => {
      const { result } = renderHook(() => useVerificationCode(defaultOptions));

      act(() => {
        result.current.handleCodeChange("a", 0);
      });

      expect(result.current.code[0]).toBe("");
    });

    it("clears error when code changes", () => {
      const { result } = renderHook(() => useVerificationCode(defaultOptions));

      // First trigger an error
      act(() => {
        result.current.handleVerify();
      });

      expect(result.current.error).toBe("Incomplete code");

      // Then change code to clear error
      act(() => {
        result.current.handleCodeChange("1", 0);
      });

      expect(result.current.error).toBe("");
    });
  });

  describe("handleVerify", () => {
    it("sets error when code is incomplete", async () => {
      const { result } = renderHook(() => useVerificationCode(defaultOptions));

      await act(async () => {
        await result.current.handleVerify();
      });

      expect(result.current.error).toBe("Incomplete code");
      expect(defaultOptions.onVerifySuccess).not.toHaveBeenCalled();
    });

    it("calls onVerifySuccess with complete code", async () => {
      const onVerifySuccess = jest.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useVerificationCode({ ...defaultOptions, onVerifySuccess }),
      );

      // Fill in all 6 digits one by one
      act(() => {
        result.current.handleCodeChange("1", 0);
      });
      act(() => {
        result.current.handleCodeChange("2", 1);
      });
      act(() => {
        result.current.handleCodeChange("3", 2);
      });
      act(() => {
        result.current.handleCodeChange("4", 3);
      });
      act(() => {
        result.current.handleCodeChange("5", 4);
      });
      act(() => {
        result.current.handleCodeChange("6", 5);
      });

      // Verify the code is complete
      expect(result.current.code.join("")).toBe("123456");

      await act(async () => {
        await result.current.handleVerify();
      });

      expect(onVerifySuccess).toHaveBeenCalledWith("123456");
    });

    it("sets error and resets code on verification failure", async () => {
      const onVerifySuccess = jest.fn().mockRejectedValue(new Error("Invalid"));
      const { result } = renderHook(() =>
        useVerificationCode({ ...defaultOptions, onVerifySuccess }),
      );

      // Fill in all 6 digits
      act(() => {
        result.current.handleCodeChange("1", 0);
      });
      act(() => {
        result.current.handleCodeChange("2", 1);
      });
      act(() => {
        result.current.handleCodeChange("3", 2);
      });
      act(() => {
        result.current.handleCodeChange("4", 3);
      });
      act(() => {
        result.current.handleCodeChange("5", 4);
      });
      act(() => {
        result.current.handleCodeChange("6", 5);
      });

      await act(async () => {
        await result.current.handleVerify();
      });

      expect(result.current.error).toBe("Invalid code");
      expect(result.current.code).toEqual(["", "", "", "", "", ""]);
    });
  });

  describe("handleResendCode", () => {
    it("does not call onResendCode when timer is active", async () => {
      const { result } = renderHook(() => useVerificationCode(defaultOptions));

      await act(async () => {
        await result.current.handleResendCode();
      });

      expect(defaultOptions.onResendCode).not.toHaveBeenCalled();
    });

    it("calls onResendCode when timer reaches 0", async () => {
      const onResendCode = jest.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useVerificationCode({
          ...defaultOptions,
          onResendCode,
          resendCooldown: 1,
        }),
      );

      // Wait for timer to reach 0
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.resendTimer).toBe(0);

      await act(async () => {
        await result.current.handleResendCode();
      });

      expect(onResendCode).toHaveBeenCalled();
    });
  });

  describe("resend timer countdown", () => {
    it("counts down every second", () => {
      const { result } = renderHook(() =>
        useVerificationCode({ ...defaultOptions, resendCooldown: 3 }),
      );

      expect(result.current.resendTimer).toBe(3);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(result.current.resendTimer).toBe(2);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(result.current.resendTimer).toBe(1);

      act(() => {
        jest.advanceTimersByTime(1000);
      });
      expect(result.current.resendTimer).toBe(0);
    });

    it("stops at 0", () => {
      const { result } = renderHook(() =>
        useVerificationCode({ ...defaultOptions, resendCooldown: 1 }),
      );

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.resendTimer).toBe(0);
    });
  });
});
