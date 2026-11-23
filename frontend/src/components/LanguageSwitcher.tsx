import { useLanguage } from "../context/useLanguage";
import "../styles/Header.css";
export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      type="button"
      className="language-switcher"
      onClick={() => setLanguage(language === "en" ? "ar" : "en")}
    >
      {language === "en" ? "العربية" : "English"}
    </button>
  );
}
