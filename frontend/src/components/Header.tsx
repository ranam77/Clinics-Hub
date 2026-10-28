
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/api";
import type { patientSession } from "../services/api";

function Header() {
  const navigate = useNavigate();

  const [patient, setPatient] = useState<patientSession | null>(() => {
    const storedPatient = sessionStorage.getItem("patientSession");

    if (!storedPatient) return null;

    try {
      return JSON.parse(storedPatient) as patientSession;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const updateAuth = () => {
      const storedPatient = sessionStorage.getItem("patientSession");

      if (!storedPatient) {
        setPatient(null);
        return;
      }

      try {
        setPatient(JSON.parse(storedPatient) as patientSession);
      } catch {
        setPatient(null);
      }
    };

    window.addEventListener("auth-change", updateAuth);

    return () => {
      window.removeEventListener("auth-change", updateAuth);
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-icon">+</span>
        <span>Clinics Box</span>
      </Link>

      <nav className="header-buttons">
        {patient && patient.f_name ? (
          <>
            <span className="welcome-user">
              Welcome, {patient.f_name} {patient.l_name}
            </span>

            <button
              type="button"
              className="login-button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-button">
              Login
            </Link>

            <Link to="/signup" className="login-button">
              Sign up
            </Link>
          </>
        )}

        <button
          type="button"
          className="login-button"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </nav>
    </header>
  );
}

export default Header;
