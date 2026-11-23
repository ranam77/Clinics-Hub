
import { useState, useEffect } from "react";
import "../styles/SearchBar.css";

function SearchBar() {
  const [language, setLanguage] = useState<"en" | "ar">(
    () => document.documentElement.lang === "ar" ? "ar" : "en"
  );

  useEffect(() => {
    const updateLanguage = (event: Event) => {
      const customEvent = event as CustomEvent<"en" | "ar">;
      setLanguage(customEvent.detail);
    };

    window.addEventListener("language-change", updateLanguage);
    return () => window.removeEventListener("language-change", updateLanguage);
  }, []);

  const isArabic = language === "ar";

  return ( 
    <section className="search-section" dir={isArabic ? "rtl" : "ltr"}>
      
      <div className="search-container">
        <div className="search-field">
          <label>{isArabic ? "التخصص" : "Specialty"}</label>
          <input
            type="text"
            placeholder={isArabic ? "اختاري التخصص" : "Choose specialty"}
          />
        </div>

        <div className="search-field">
          <label>{isArabic ? "المدينة" : "City"}</label>
          <input
            type="text"
            placeholder={isArabic ? "اختاري المدينة" : "Choose city"}
          />
        </div>

        <div className="search-field">
          <label>{isArabic ? "الحي" : "District"}</label>
          <input
            type="text"
            placeholder={isArabic ? "اختاري الحي" : "Choose district"}
          />
        </div>

        <div className="search-field doctor-field">
          <label>{isArabic ? "اسم الطبيب أو العيادة" : "Doctor or Clinic"}</label>
          <input
            type="text"
            placeholder={isArabic ? "اكتبي الاسم" : "Enter name"}
          />
        </div>

        <button type="button" className="search-submit">
          {isArabic ? "ابحث" : "Search"}
        </button>

      </div>
    </section>
  );
}

export default SearchBar;
