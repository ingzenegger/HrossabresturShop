import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { useAppStore } from "@/shared/store/appStore";
import en from "./locales/en.json";
import is from "./locales/is.json";

export const resources = {
  en: { translation: en },
  is: { translation: is },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: useAppStore.getState().language,
  supportedLngs: ["en", "is"],
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;