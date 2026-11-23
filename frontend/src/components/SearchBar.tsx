
import { useLanguage } from "../context/useLanguage";
import { translations } from "../context/translations";
import "../styles/SearchBar.css";

function SearchBar() {
  const { language } = useLanguage();
  const t = translations[language];
  const isArabic = language === "ar";

  return (
    <section
      className="search-section"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="search-container">

        <div className="search-field">
          <label>{t.specializations}</label>
          <input
            type="text"
            placeholder={t.chooseSpecialty}
          />
        </div>

        <div className="search-field">
          <label>{t.city}</label>
          <input
            type="text"
            placeholder={t.chooseCity}
          />
        </div>

        <div className="search-field">
          <label>{t.district}</label>
          <input
            type="text"
            placeholder={t.chooseDistrict}
          />
        </div>

        <div className="search-field doctor-field">
          <label>{t.doctorOrClinic}</label>
          <input
            type="text"
            placeholder={t.enterName}
          />
        </div>

        <button type="button" className="search-submit">
          {t.search}
        </button>

      </div>
    </section>
  );
}

export default SearchBar;
