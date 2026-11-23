
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jfif";
import "../styles/Footer.css";

function Footer() {
  const [language, setLanguage] = useState<"en" | "ar">(
    () => (document.documentElement.lang === "ar" ? "ar" : "en")
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
    <footer className="footer" dir={isArabic ? "rtl" : "ltr"}>
      <div className="footer-container">

        <div className="footer-column footer-brand">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="Clinics Hub" />
          </Link>

          <p>
            {isArabic
              ? "صحتك أولويتنا. اكتشف أفضل العيادات واحجز موعدك بسهولة."
              : "Your Health. Our Priority. Find the right clinic and book your appointment easily."}
          </p>
        </div>

        <div className="footer-column">
          <h3>{isArabic ? "عن Clinics Hub" : "About Clinics Hub"}</h3>
          <Link to="/">{isArabic ? "من نحن" : "About Us"}</Link>
          <Link to="/">{isArabic ? "رؤيتنا" : "Our Vision"}</Link>
          <Link to="/">{isArabic ? "اتصل بنا" : "Contact Us"}</Link>
        </div>

        <div className="footer-column">
          <h3>{isArabic ? "ابحث عن طريق" : "Find By"}</h3>
          <Link to="/">{isArabic ? "التخصص" : "Specialty"}</Link>
          <Link to="/">{isArabic ? "العيادات" : "Clinics"}</Link>
          <Link to="/">{isArabic ? "الأطباء" : "Doctors"}</Link>
          <Link to="/">{isArabic ? "الموقع" : "Location"}</Link>
        </div>

        <div className="footer-column">
          <h3>{isArabic ? "حسابك" : "Your Account"}</h3>
          <Link to="/login">{isArabic ? "تسجيل الدخول" : "Login"}</Link>
          <Link to="/signup">{isArabic ? "إنشاء حساب" : "Create Account"}</Link>
          <Link to="/UsersAppointments">
            {isArabic ? "مواعيدي" : "My Appointments"}
          </Link>
        </div>

        <div className="footer-column">
          <h3>{isArabic ? "تحتاج للمساعدة؟" : "Need Help?"}</h3>
          <a href="mailto:info@clinicshub.com">
            {isArabic ? "اتصل بنا" : "Contact Support"}
          </a>
          <Link to="/">{isArabic ? "شروط الاستخدام" : "Terms of Use"}</Link>
          <Link to="/">{isArabic ? "سياسة الخصوصية" : "Privacy Policy"}</Link>
        </div>

      </div>

      <div className="footer-bottom">
        <div className="footer-social">
          <a href="#" aria-label="Facebook">Facebook</a>
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="LinkedIn">LinkedIn</a>
        </div>

        <p>
          © {new Date().getFullYear()} Clinics Hub.
          {isArabic ? " جميع الحقوق محفوظة." : " All rights reserved."}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
