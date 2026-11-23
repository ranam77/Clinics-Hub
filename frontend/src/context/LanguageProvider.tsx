import { useEffect, useState, type ReactNode } from "react";
import { LanguageContext, type Language } from "./LanguageContext";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    return localStorage.getItem("language") === "ar" ? "ar" : "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        isArabic: language === "ar",
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}