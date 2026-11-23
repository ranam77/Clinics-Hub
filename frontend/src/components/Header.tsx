
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getCurrentSession } from "../services/api";
import type { patientSession } from "../types/Patient";
import "../styles/Header.css";
import logo from "../assets/logo.jfif";

function Header() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState<patientSession | null>(() => {
    try {
      return getCurrentSession();
    } catch {
      return null;
    }
  });

  const [language, setLanguage] = useState<"en" | "ar">("en");
  const isArabic = language === "ar";

  useEffect(() => {
    const updateAuth = () => {
      try {
        setPatient(getCurrentSession());
      } catch {
        setPatient(null);
      }
    };

    window.addEventListener("auth-change", updateAuth);
    return () => window.removeEventListener("auth-change", updateAuth);
  }, []);

  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isArabic]);

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

const toggleLanguage = () => {
  setLanguage((prev) => {
    const next = prev === "en" ? "ar" : "en";
    window.dispatchEvent(new CustomEvent("language-change", {
      detail: next
    }));
    return next;
  });
};

  return (
    <header className="header">
      <div className="header-container">

<div className="construction-flag"> 🚧 Under Construction </div>
        <Link to="/" className="logo">
          <img src={logo} alt="Clinics Hub" className="logo-image" />
        </Link>

        <nav className="header-nav">
          <Link to="/" className="nav-link">
            {isArabic ? "الرئيسية" : "Home"}
          </Link>

          <Link to="/" className="nav-link">
            {isArabic ? "العيادات" : "Clinics"}
          </Link>
          <Link to="/" className="nav-link">
            {isArabic ? "التخصصات" : "Specializations"}
          </Link>
          {patient && (
            <Link to="/UsersAppointments" className="nav-link">
              {isArabic ? "مواعيدي" : "My Appointments"}
            </Link>
          )}
        </nav>

        <div className="header-actions">
          

          {patient && patient.f_name ? (
            <>
              <span className="welcome-user">
                {isArabic ? `مرحباً، ${patient.f_name}` : `Welcome, ${patient.f_name}`}
              </span>

              <button
                type="button"
                className="nav-link"
                onClick={handleLogout}
              >
                {isArabic ? "تسجيل الخروج" : "Log Out"}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                {isArabic ? "دخول" : "Login"}
              </Link>

              <Link to="/signup" className="nav-link">
                {isArabic ? "إنشاء حساب" : "Sign Up"}
              </Link>
            </>
          )}
          <button
            type="button"
            className="nav-link"
            onClick={toggleLanguage}
          >
            {isArabic ? "English" : "العربية"}
          </button>
        </div>

      </div>
    </header>
  );
}

export default Header;
