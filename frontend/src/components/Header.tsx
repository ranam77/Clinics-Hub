
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { logout, getCurrentSession } from "../services/api";
import type { patientSession } from "../services/api";

function Header() {
  const navigate = useNavigate();
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
