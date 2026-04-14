import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n, { changeLanguage } from "../i18n";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("i18n", () => {
  it("initializes with ru as default language", () => {
    expect(i18n.language).toBe("ru");
  });

  it("has ru as fallback language", () => {
    expect(i18n.options.fallbackLng).toEqual(["ru"]);
  });

  it("has both en and ru resources", () => {
    expect(i18n.hasResourceBundle("en", "translation")).toBe(true);
    expect(i18n.hasResourceBundle("ru", "translation")).toBe(true);
  });
});

describe("changeLanguage", () => {
  it("changes language to en and persists to AsyncStorage", async () => {
    await changeLanguage("en");

    expect(i18n.language).toBe("en");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@tipster_language",
      "en",
    );
  });

  it("changes language back to ru", async () => {
    await changeLanguage("ru");

    expect(i18n.language).toBe("ru");
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      "@tipster_language",
      "ru",
    );
  });

  it("handles storage errors gracefully", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
      new Error("Storage error"),
    );

    await changeLanguage("en");

    expect(warnSpy).toHaveBeenCalledWith(
      "Error changing language:",
      expect.any(Error),
    );
    warnSpy.mockRestore();
  });
});
