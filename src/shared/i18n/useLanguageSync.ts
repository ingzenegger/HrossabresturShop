import { useEffect } from "react";
import { useAppStore } from "@/shared/store/appStore";
import i18n from "./i18n";

export function useLanguageSync() {
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  }, [language]);
}