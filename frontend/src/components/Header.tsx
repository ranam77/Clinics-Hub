import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout, getCurrentSession } from "../services/api";
import type { patientSession } from "../types/Patient";
import "../styles/Header.css";
import logo from "../assets/logo.jfif";
import { useLanguage } from "../context/useLanguage";
import { translations } from "../context/translations";
import LanguageSwitcher from "./LanguageSwitcher";
function Header() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [patient, setPatient] = useState<patientSession | null>(() => {
    try {
      return getCurrentSession();
    } catch {
      return null;
    }
  });
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

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };


  return (
    <header className="header">
      <div className="header-container">
      <div className="construction-flag"> 🚧 Under Construction </div>
        <nav className="header-nav">
          <Link to="/" className="nav-link">
            {t.home}
          </Link>

          <Link to="/" className="nav-link">
            {t.clinics}
          </Link>
          <Link to="/" className="nav-link">
            {t.Specializations}
          </Link>
          {patient && (
            <Link to="/UsersAppointments" className="nav-link">
               {t.myAppointments}
            </Link>
          )}
        </nav>

        <div className="header-actions">         

          {patient && patient.f_name ? (
            <>
              <span className="welcome-user">
                {t.hello} ${patient.f_name}
              </span>

              <button
                type="button"
                className="nav-link"
                onClick={handleLogout}
              >
                {t.logout}  
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
              {t.login}
              </Link>

              <Link to="/signup" className="nav-link">
               {t.signup}
              </Link>
            </>
          )}
          <LanguageSwitcher/>  
        </div>
        <Link to="/" className="logo">
          <img src={logo} alt="Clinics Hub" className="logo-image" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
