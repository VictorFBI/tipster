/**
 * Tests for errorHandler utility functions.
 *
 * Because axios is globally mocked (to avoid expo/streams issues), we
 * construct lightweight AxiosError-like objects manually.
 */

import {
  getErrorMessage,
  isNetworkError,
  isAuthError,
  isValidationError,
  formatErrorForDisplay,
} from "../errorHandler";

// Re-create a minimal AxiosError shape that passes `instanceof AxiosError`
// Since axios is mocked, we import the mock's AxiosError class.
const { AxiosError } = jest.requireMock("axios");

/**
 * Helper: create a minimal AxiosError with the given status and optional
 * response body.
 */
function makeAxiosError(
  status: number | undefined,
  data?: unknown,
  opts?: { code?: string; message?: string },
) {
  const error = new AxiosError(
    opts?.message ?? "Request failed",
    opts?.code ?? "ERR_BAD_REQUEST",
    undefined,
    undefined,
    status
      ? {
          data: data ?? {},
          status,
          statusText: "",
          headers: {},
          config: { headers: {} },
        }
      : undefined,
  );
  return error;
}

// ---------------------------------------------------------------------------
// getErrorMessage
// ---------------------------------------------------------------------------
describe("getErrorMessage", () => {
  it("returns user-already-exists message when API says so", () => {
    const err = makeAxiosError(400, { message: "User already exists" });
    expect(getErrorMessage(err)).toBe(
      "Пользователь с таким email уже зарегистрирован.",
    );
  });

  it("returns user-already-exists message for 'already registered'", () => {
    const err = makeAxiosError(400, { message: "Already registered" });
    expect(getErrorMessage(err)).toBe(
      "Пользователь с таким email уже зарегистрирован.",
    );
  });

  it("returns 400 message", () => {
    const err = makeAxiosError(400);
    expect(getErrorMessage(err)).toBe(
      "Неверный запрос. Проверьте введенные данные.",
    );
  });

  it("returns 401 message", () => {
    const err = makeAxiosError(401);
    expect(getErrorMessage(err)).toBe(
      "Неверный логин или пароль. Проверьте данные и попробуйте снова.",
    );
  });

  it("returns 403 message", () => {
    const err = makeAxiosError(403);
    expect(getErrorMessage(err)).toBe("Доступ запрещен.");
  });

  it("returns 404 message", () => {
    const err = makeAxiosError(404);
    expect(getErrorMessage(err)).toBe("Ресурс не найден.");
  });

  it("returns 429 message", () => {
    const err = makeAxiosError(429);
    expect(getErrorMessage(err)).toBe(
      "Слишком много попыток. Попробуйте позже.",
    );
  });

  it("returns 500 message", () => {
    const err = makeAxiosError(500);
    expect(getErrorMessage(err)).toBe("Ошибка сервера. Попробуйте позже.");
  });

  it("falls back to error.message for unknown status", () => {
    const err = makeAxiosError(418, {}, { message: "I'm a teapot" });
    expect(getErrorMessage(err)).toBe("I'm a teapot");
  });

  it("handles plain Error instances", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("handles unknown error types", () => {
    expect(getErrorMessage("something")).toBe("Произошла неизвестная ошибка.");
  });

  it("handles null/undefined", () => {
    expect(getErrorMessage(null)).toBe("Произошла неизвестная ошибка.");
    expect(getErrorMessage(undefined)).toBe("Произошла неизвестная ошибка.");
  });
});

// ---------------------------------------------------------------------------
// isNetworkError
// ---------------------------------------------------------------------------
describe("isNetworkError", () => {
  it("returns true for network errors", () => {
    const err = makeAxiosError(undefined, undefined, {
      code: "ERR_NETWORK",
      message: "Network Error",
    });
    expect(isNetworkError(err)).toBe(true);
  });

  it("returns false for non-network AxiosErrors", () => {
    const err = makeAxiosError(500);
    expect(isNetworkError(err)).toBe(false);
  });

  it("returns false for plain errors", () => {
    expect(isNetworkError(new Error("fail"))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isAuthError
// ---------------------------------------------------------------------------
describe("isAuthError", () => {
  it("returns true for 401", () => {
    expect(isAuthError(makeAxiosError(401))).toBe(true);
  });

  it("returns false for other statuses", () => {
    expect(isAuthError(makeAxiosError(403))).toBe(false);
  });

  it("returns false for non-Axios errors", () => {
    expect(isAuthError(new Error("nope"))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isValidationError
// ---------------------------------------------------------------------------
describe("isValidationError", () => {
  it("returns true for 400", () => {
    expect(isValidationError(makeAxiosError(400))).toBe(true);
  });

  it("returns false for other statuses", () => {
    expect(isValidationError(makeAxiosError(500))).toBe(false);
  });

  it("returns false for non-Axios errors", () => {
    expect(isValidationError("string")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// formatErrorForDisplay
// ---------------------------------------------------------------------------
describe("formatErrorForDisplay", () => {
  it("returns network error format", () => {
    const err = makeAxiosError(undefined, undefined, {
      code: "ERR_NETWORK",
      message: "Network Error",
    });
    const result = formatErrorForDisplay(err);
    expect(result.title).toBe("Ошибка сети");
    expect(result.message).toContain("подключение к интернету");
  });

  it("returns auth error format for 401", () => {
    const result = formatErrorForDisplay(makeAxiosError(401));
    expect(result.title).toBe("Ошибка авторизации");
  });

  it("returns validation error format for 400", () => {
    const result = formatErrorForDisplay(makeAxiosError(400));
    expect(result.title).toBe("Ошибка валидации");
  });

  it("returns generic error format for other errors", () => {
    const result = formatErrorForDisplay(new Error("oops"));
    expect(result.title).toBe("Ошибка");
    expect(result.message).toBe("oops");
  });
});
