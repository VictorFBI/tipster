import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from "../locales/en/translation.json";
import ru from "../locales/ru/translation.json";

const LANGUAGE_KEY = "@tipster_language";

const resources = {
  en: { translation: en },
  ru: { translation: ru },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ru",
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: "v3",
});

AsyncStorage.getItem(LANGUAGE_KEY)
  .then((savedLanguage) => {
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ru")) {
      i18n.changeLanguage(savedLanguage);
    }
  })
  .catch((error) => {
    console.warn("Error loading language preference:", error);
  });

export const changeLanguage = async (language: string) => {
  try {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem(LANGUAGE_KEY, language);
  } catch (error) {
    console.warn("Error changing language:", error);
  }
};

export default i18n;
